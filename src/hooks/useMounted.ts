"use client";

import * as React from "react";

const subscribe = () => () => {};

/**
 * Returns `true` only after the component has mounted on the client.
 *
 * Implemented with `useSyncExternalStore` so the server snapshot (`false`) and
 * the first client render agree during hydration — no `setState` in an effect
 * and no hydration mismatch. Use it to gate rendering that depends on the
 * current date/time or other browser-only values.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
