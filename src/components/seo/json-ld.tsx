import type { JsonLd as JsonLdDocument } from "@/lib/seo";

export interface JsonLdProps {
  data: JsonLdDocument | JsonLdDocument[];
}

/**
 * Serialize a JSON-LD document for embedding in a `<script>` tag.
 *
 * `<`, `>` and `&` are escaped to their unicode forms so a value containing
 * `</script>` (or similar) can never terminate the tag and inject markup. The
 * line separators are escaped too, as they are invalid in JSON strings.
 */
function serialize(document: JsonLdDocument): string {
  return JSON.stringify(document)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Renders one or more JSON-LD documents. Content is generated from the same
 * authored data the page renders, so it stays accurate.
 */
export function JsonLd({ data }: JsonLdProps) {
  const documents = Array.isArray(data) ? data : [data];
  return (
    <>
      {documents.map((document, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(document) }}
        />
      ))}
    </>
  );
}
