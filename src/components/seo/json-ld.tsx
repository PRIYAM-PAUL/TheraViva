import type { JsonLd as JsonLdDocument } from "@/lib/seo";

export interface JsonLdProps {
  data: JsonLdDocument | JsonLdDocument[];
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(document) }}
        />
      ))}
    </>
  );
}
