/**
 * One JSON-LD block. A server component: structured data is read by crawlers
 * from the HTML, so it has to be in the response rather than added on hydrate.
 *
 * `<` is escaped because the payload is written into a <script> element, where
 * a literal "</script>" inside any string value would close it early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
