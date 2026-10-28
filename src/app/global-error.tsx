"use client";

import { useEffect } from "react";

/**
 * Last-resort error boundary. It replaces the root layout, so it must render
 * its own `<html>` and `<body>`. Styling is intentionally inline and minimal —
 * it cannot rely on the app's CSS being available.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#ffffff",
          color: "#1c1917",
        }}
      >
        <main style={{ maxWidth: 480, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#57534e", lineHeight: 1.6 }}>
            The site hit an unexpected error. Please reload the page — if it
            keeps happening, contact the practice directly.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: "#0f766e",
              color: "#f0fdfa",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
