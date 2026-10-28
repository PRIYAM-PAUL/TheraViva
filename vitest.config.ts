import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for component and unit tests.
 *
 * `jsdom` gives the theme provider and switcher a real DOM (and `localStorage`
 * / `matchMedia`), and the `@` alias mirrors the `tsconfig.json` path mapping
 * so tests import exactly what the app does.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/theme.ts", "src/components/theme/**/*.{ts,tsx}"],
    },
  },
});
