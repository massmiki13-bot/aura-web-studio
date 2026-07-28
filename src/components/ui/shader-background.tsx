import { useEffect, useRef } from "react";
import { rafDebounce } from "@/lib/utils";

/**
 * WebGL fragment-shader background (adapted from a vendored "animated shader
 * hero" component). Only the canvas + render loop is kept — the original's
 * own headline/CTA markup and styled-jsx animations are dropped since this
 * project supplies its own copy and doesn't use styled-jsx (Vite, not
 * Next.js). The shader's palette was recolored from warm orange/amber to a
 * neutral silver/graphite tone to match the site's monochrome theme.
 *
 * Rendering strategy — the effect is two very different workloads glued
 * together, so it's split into two passes instead of paying for both at one
 * compromise resolution:
 *
 *  1. clouds pass — fbm noise sampled ~15×/pixel, but the output is soft and
 *     low-frequency. Rendered at a fraction of the star resolution into a
 *     linearly-filtered texture; the upscale is invisible.
 *  2. star pass — thin bright points/streaks, ~11 loop iterations per pixel.
 *     This is where essentially all the GPU time goes, so it is the pass whose
 *     resolution is governed (see below), and it dithers its output to kill
 *     8-bit banding in the dark gradients.
 *
 * Three things keep it smooth rather than merely cheap:
 *
 *  - **Adaptive resolution.** A fixed pixel budget is a guess about a machine
 *    we've never met; on anything with integrated graphics the star loop at
 *    hi-DPI simply cannot hold 60fps, and the result was a background that
 *    crawled. So the drawing buffer is sized by a controller that watches real
 *    frame intervals and walks the resolution down until frames land on time
 *    (and carefully back up if there's headroom). A slightly soft background
 *    at 60fps beats a sharp one at 25.
 *  - **A ~60fps cap.** On 120/144Hz displays the loop would otherwise render
 *    twice as many frames as anyone can perceive here, for a slow ambient
 *    drift, and starve everything else on the page.
 *  - **Deferred start.** Nothing is created until the layer is actually asked
 *    to run (`paused` is the hero's gate, and it stays true through first
 *    load), so context creation and shader compilation don't land in the
 *    middle of hydration.
 *
 * If the offscreen framebuffer can't be created, it falls back to the original
 * single-pass shader at a conservative resolution. The loop also stops
 * entirely while `paused` or when scrolled out of view.
 */

// Shared noise library (identical math to the original single-pass shader).
const GLSL_NOISE = /* glsl */ `
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
`;

const GLSL_CLOUDS = /* glsl */ `
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) { t+=a*noise(p); p*=2.*m; a*=.5; }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
`;

const VERTEX_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec4 position;
void main(){gl_Position=position;}`;

// Pass 1: clouds only, at a fraction of the star resolution. Coordinates are
// normalized against the *main* resolution so each texel matches what the
// single-pass shader would have computed at the corresponding full-res pixel.
const CLOUDS_PASS_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform vec2 lowResolution;
uniform float time;
${GLSL_NOISE}
${GLSL_CLOUDS}
void main(void) {
  vec2 fc=gl_FragCoord.xy/lowResolution*resolution;
  vec2 uv=(fc-.5*resolution)/min(resolution.x,resolution.y);
  vec2 st=uv*vec2(2,1);
  float bg=clouds(vec2(st.x+time*.5,-st.y));
  O=vec4(bg,bg,bg,1.);
}`;

// Pass 2: the star loop, clouds from texture.
const STARS_PASS_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform sampler2D cloudsTex;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
${GLSL_NOISE}
void main(void) {
  vec2 uv=(FC-.5*R)/MN;
  float bg=texture(cloudsTex,FC/R).r;
  vec3 col=vec3(0);
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d;
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.22,bg*.22,bg*.25),d);
  }
  float luma=dot(col, vec3(0.299,0.587,0.114));
  col=vec3(luma)*vec3(0.82,0.85,0.95);
  // Ordered-noise dither: ±0.5/255 breaks up the visible banding that 8-bit
  // output produces in the near-black cloud gradients.
  col+=(rnd(FC+fract(T))-.5)/255.;
  O=vec4(col,1);
}`;

// Fallback: the original single-pass shader (clouds + stars per pixel).
const SINGLE_PASS_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
${GLSL_NOISE}
${GLSL_CLOUDS}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d;
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.22,bg*.22,bg*.25),d);
  }
  float luma=dot(col, vec3(0.299,0.587,0.114));
  col=vec3(luma)*vec3(0.82,0.85,0.95);
  O=vec4(col,1);
}`;

// Fast-machine ceilings. The drawing buffer is sized once from these and then
// left alone — the star pass renders thin, bright, moving streaks, and those
// shimmer and pop the instant their resolution changes underfoot, so the
// resolution must be stable, not chased frame to frame.
const TWO_PASS_MAX_PIXELS = 2_400_000;
const SINGLE_PASS_MAX_PIXELS = 900_000;
const TWO_PASS_MAX_DPR = 1.5;
const CLOUDS_DOWNSCALE = 3; // fixed: the clouds are soft, the stars are not
const MIN_QUALITY = 0.7; // never drop the stars far enough to alias badly
const MAX_QUALITY = 1;

// One-shot calibration. A weak GPU gets a single resolution step-down, taken
// early — while the canvas is still fading up from transparent, so the change
// is invisible — and then the resolution is frozen for good. There is no
// continuous up/down: that churn was the "flashing" (every resize re-rasterises
// the whole field of streaks at a new sampling grid).
const CALIBRATION_MS = 520; // decided before the fade is halfway in
const SLOW_FRAME_MS = 1000 / 40; // sustained slower than 40fps → step down once

type Uniforms = Record<string, WebGLUniformLocation | null>;

class ShaderRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private starsProgram: WebGLProgram | null = null;
  private cloudsProgram: WebGLProgram | null = null;
  private singleProgram: WebGLProgram | null = null;
  private starsUniforms: Uniforms = {};
  private cloudsUniforms: Uniforms = {};
  private singleUniforms: Uniforms = {};
  private buffer: WebGLBuffer | null = null;
  private fbo: WebGLFramebuffer | null = null;
  private fboTex: WebGLTexture | null = null;
  private lowW = 1;
  private lowH = 1;
  private cssW = 1;
  private cssH = 1;
  // Starts at full and only ever steps down once, during calibration.
  quality = MAX_QUALITY;
  twoPass = false;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.canvas = canvas;
    this.gl = gl;
  }

  private compileProgram(fragSrc: string): WebGLProgram | null {
    const gl = this.gl;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SRC);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fragSrc);
    gl.compileShader(fs);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    // Shaders are owned by the program from here on.
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  private locate(program: WebGLProgram, names: string[]): Uniforms {
    const out: Uniforms = {};
    for (const n of names) out[n] = this.gl.getUniformLocation(program, n);
    return out;
  }

  /** Returns false when no usable program could be built (canvas stays black). */
  setup(): boolean {
    const gl = this.gl;

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.starsProgram = this.compileProgram(STARS_PASS_SRC);
    this.cloudsProgram = this.compileProgram(CLOUDS_PASS_SRC);

    if (this.starsProgram && this.cloudsProgram) {
      this.fboTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.fboTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.fboTex, 0);
      this.twoPass = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    if (this.twoPass) {
      this.starsUniforms = this.locate(this.starsProgram!, ["resolution", "time", "cloudsTex"]);
      this.cloudsUniforms = this.locate(this.cloudsProgram!, [
        "resolution",
        "lowResolution",
        "time",
      ]);
      return true;
    }

    this.singleProgram = this.compileProgram(SINGLE_PASS_SRC);
    if (!this.singleProgram) return false;
    this.singleUniforms = this.locate(this.singleProgram, ["resolution", "time"]);
    return true;
  }

  /** Device pixels per CSS pixel for the current quality setting. */
  private pixelScale(cssWidth: number, cssHeight: number) {
    const dpr = window.devicePixelRatio || 1;
    const base = this.twoPass ? Math.min(dpr, TWO_PASS_MAX_DPR) : Math.min(dpr, 1);
    const budget = this.twoPass ? TWO_PASS_MAX_PIXELS : SINGLE_PASS_MAX_PIXELS;
    let scale = base * this.quality;
    const area = Math.max(1, cssWidth * cssHeight);
    if (area * scale * scale > budget) scale = Math.sqrt(budget / area);
    // Floored well above 0.5: below roughly one device pixel per CSS pixel the
    // star streaks start to crawl and sparkle as they move.
    return Math.max(0.75, scale);
  }

  /** Sizes the drawing buffer (and clouds texture) for the given CSS size. */
  resize(cssWidth = this.cssW, cssHeight = this.cssH) {
    const gl = this.gl;
    this.cssW = cssWidth;
    this.cssH = cssHeight;
    const scale = this.pixelScale(cssWidth, cssHeight);

    this.canvas.width = Math.max(1, Math.round(cssWidth * scale));
    this.canvas.height = Math.max(1, Math.round(cssHeight * scale));

    if (this.twoPass) {
      // The clouds are soft and low-frequency, so a fixed fraction of the star
      // resolution is plenty and it keeps the backdrop's look constant.
      this.lowW = Math.max(1, Math.round(this.canvas.width / CLOUDS_DOWNSCALE));
      this.lowH = Math.max(1, Math.round(this.canvas.height / CLOUDS_DOWNSCALE));
      gl.bindTexture(gl.TEXTURE_2D, this.fboTex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        this.lowW,
        this.lowH,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
    }
  }

  /** Returns true when the quality actually moved (and the buffers resized). */
  setQuality(next: number) {
    const clamped = Math.min(MAX_QUALITY, Math.max(MIN_QUALITY, next));
    if (Math.abs(clamped - this.quality) < 0.02) return false;
    this.quality = clamped;
    this.resize();
    return true;
  }

  /** Was the buffer already sized down as far as it goes? */
  get atFloor() {
    return this.quality <= MIN_QUALITY + 0.01;
  }

  render(now = 0) {
    const gl = this.gl;
    const t = now * 1e-3;
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (this.twoPass) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
      gl.viewport(0, 0, this.lowW, this.lowH);
      gl.useProgram(this.cloudsProgram);
      gl.uniform2f(this.cloudsUniforms.resolution, w, h);
      gl.uniform2f(this.cloudsUniforms.lowResolution, this.lowW, this.lowH);
      gl.uniform1f(this.cloudsUniforms.time, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, w, h);
      gl.useProgram(this.starsProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.fboTex);
      gl.uniform1i(this.starsUniforms.cloudsTex, 0);
      gl.uniform2f(this.starsUniforms.resolution, w, h);
      gl.uniform1f(this.starsUniforms.time, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return;
    }

    gl.viewport(0, 0, w, h);
    gl.useProgram(this.singleProgram);
    gl.uniform2f(this.singleUniforms.resolution, w, h);
    gl.uniform1f(this.singleUniforms.time, t);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose() {
    const gl = this.gl;
    if (this.starsProgram) gl.deleteProgram(this.starsProgram);
    if (this.cloudsProgram) gl.deleteProgram(this.cloudsProgram);
    if (this.singleProgram) gl.deleteProgram(this.singleProgram);
    if (this.buffer) gl.deleteBuffer(this.buffer);
    if (this.fboTex) gl.deleteTexture(this.fboTex);
    if (this.fbo) gl.deleteFramebuffer(this.fbo);
  }
}

export function ShaderBackground({
  className = "",
  paused = false,
}: {
  className?: string;
  /** Externally stop/resume the render loop — e.g. while this layer is
   *  faded out behind other content, or before the page has finished
   *  booting. Nothing is created at all until it first goes false. */
  paused?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const syncRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: ShaderRenderer | null = null;
    let failed = false;
    let disposed = false;

    // Context creation + shader compilation is a single long main-thread task;
    // it happens the first time this layer is actually asked to draw, not at
    // mount, so it can't land in the middle of hydration.
    const ensureRenderer = () => {
      if (renderer || failed || disposed) return renderer;
      // No AA/depth/stencil needed for fullscreen quads, and an opaque canvas
      // is cheaper to composite. If WebGL2 is unavailable the background simply
      // stays black — which is the site background anyway.
      const gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }) as WebGL2RenderingContext | null;
      if (!gl) {
        failed = true;
        return null;
      }
      const next = new ShaderRenderer(canvas, gl);
      if (!next.setup()) {
        next.dispose();
        failed = true;
        return null;
      }
      next.resize(canvas.clientWidth, canvas.clientHeight);
      renderer = next;
      return renderer;
    };

    let raf = 0;
    let running = false;
    let intersecting = true;
    let revealed = false;

    // One-shot calibration state. No frame is ever *skipped* — the content is
    // wall-clock based (see render()), so the smoothest possible presentation
    // is simply to draw on every vsync at whatever the display refreshes at.
    // These only decide the single early resolution step-down.
    let lastRender = 0;
    let calibrated = false;
    let calibStart = 0;
    let calibSum = 0;
    let calibFrames = 0;
    const CALIB_WARMUP = 4; // ignore the first few frames (shader warm-up)

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = lastRender ? now - lastRender : 0;
      lastRender = now;

      renderer?.render(now);

      // Fade up on the first drawn frame — this is also the window the one
      // calibration step-down hides inside.
      if (!revealed) {
        revealed = true;
        canvas.style.opacity = "1";
      }

      if (calibrated || !renderer) return;
      if (!calibStart) {
        calibStart = now;
        return;
      }
      // Ignore warm-up frames and any stall (a backgrounded tab, a long
      // main-thread task) — neither reflects steady-state GPU cost.
      if (calibFrames >= 0 && dt > 0 && dt < 200) {
        calibFrames += 1;
        if (calibFrames > CALIB_WARMUP) calibSum += dt;
      }
      if (now - calibStart >= CALIBRATION_MS) {
        calibrated = true;
        const scored = Math.max(1, calibFrames - CALIB_WARMUP);
        const avg = calibSum / scored;
        // Struggling → one step down, taken now while the canvas is still
        // most of the way transparent, and then never revisited.
        if (avg > SLOW_FRAME_MS && !renderer.atFloor) renderer.setQuality(MIN_QUALITY);
      }
    };

    const sync = () => {
      const shouldRun = intersecting && !pausedRef.current && !failed;
      if (shouldRun && !running) {
        if (!ensureRenderer()) return;
        running = true;
        lastRender = 0;
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    syncRef.current = sync;
    sync();

    // Perf only: stop rendering once scrolled well past the (pinned) hero,
    // resume if it ever comes back into view.
    const io = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        sync();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    const onResize = rafDebounce(() => {
      if (!renderer) return;
      // Keep whatever quality calibration settled on; just refit the buffer to
      // the new CSS box. A viewport resize is a deliberate, one-off event, not
      // the per-frame churn that caused the shimmering.
      renderer.resize(canvas.clientWidth, canvas.clientHeight);
    });
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      onResize.cancel();
      cancelAnimationFrame(raf);
      io.disconnect();
      syncRef.current = null;
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full touch-none ${className}`}
      // Faded in on the first drawn frame so the layer never pops in mid-load —
      // and long enough that the one-shot resolution calibration (~520ms in)
      // happens while the canvas is still well under half opacity.
      style={{ background: "black", opacity: 0, transition: "opacity 1200ms ease-out" }}
    />
  );
}
