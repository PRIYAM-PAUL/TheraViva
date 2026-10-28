import { themeInitScript } from "@/lib/theme";

/**
 * Renders the no-flash theme bootstrap as the first element in `<body>`.
 *
 * The script is synchronous and self-contained, so it runs before the rest of
 * the body paints and sets `data-theme` on `<html>` ahead of first paint. It
 * reads `localStorage` and, when there is no stored choice, the OS colour
 * scheme. Server and client render the identical string, so hydration matches.
 */
export function ThemeScript() {
  return (
    <script
      // The payload is a static string built from local constants — no user
      // input — so there is no injection surface.
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
