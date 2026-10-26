import { siteConfig } from "@/config";

/**
 * RFC 9116 security.txt, served at /.well-known/security.txt.
 *
 * The contact address is a documented placeholder — replace it with a real,
 * monitored security contact before launch. `Expires` is generated one year
 * ahead so the file stays valid without manual upkeep.
 */
export function GET(): Response {
  const expires = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const lines = [
    `Contact: mailto:${siteConfig.contact.email}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${siteConfig.url}/.well-known/security.txt`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
