"use client";

/**
 * An inline script that runs from the server HTML and nowhere else.
 *
 * The browser executes it while parsing, which is the whole point. React on
 * the client never executes a `<script>` it renders, and warns every time it
 * has to create one (a remount, a client re-render after a recoverable error).
 * So on the client the element is typed as a data block: React treats that as
 * inert and stays quiet, and nothing is lost because the code already ran.
 *
 * During hydration the existing element is adopted, not recreated, so the
 * `type` difference is never written to the DOM — suppressHydrationWarning
 * only silences the attribute mismatch report.
 */
export function InlineScript({ code }: { code: string }) {
  return (
    <script
      type={typeof window === "undefined" ? undefined : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
