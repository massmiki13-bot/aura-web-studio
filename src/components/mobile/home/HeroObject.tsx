"use client";

/**
 * A slowly turning armillary behind the masthead: three rings on different
 * axes, each rotating at its own rate, with a lit core at the centre.
 *
 * Real 3D — the rings are laid out in a `preserve-3d` space with actual
 * perspective, so the near edge of each ring passes in front of the core and
 * the far edge behind it — but no WebGL. Five elements and three CSS
 * keyframes on `transform`, which the compositor runs on its own thread: it
 * keeps turning smoothly even while the main thread is busy laying out the
 * rest of the page, and it costs nothing to start because there is no context
 * to create, no shader to compile and no runtime to download.
 *
 * That distinction is the whole reason this is not the desktop's chrome
 * object. A WebGL scene on a phone masthead means a GPU context alive for as
 * long as the page is, on the device with the least thermal headroom — and it
 * is what made the first attempt at a phone hero read as a smeared blob.
 *
 * Deliberately faint and deliberately behind: it frames the headline, and if
 * you find yourself reading it rather than the words, it is too strong.
 */
export function MobileHeroObject({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="hero-armillary">
        <span className="hero-ring hero-ring--a" />
        <span className="hero-ring hero-ring--b" />
        <span className="hero-ring hero-ring--c" />
        <span className="hero-core" />
      </div>
    </div>
  );
}
