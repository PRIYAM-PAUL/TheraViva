/**
 * Cross-cutting utility types shared across the application.
 * No runtime code — types only.
 */

/** A value that may explicitly be `null` (e.g. "not selected yet"). */
export type Nullable<T> = T | null;

/** A value that may be absent or `null`. */
export type Maybe<T> = T | null | undefined;

/** Attach a string `id` to a shape. */
export type WithId<T> = T & { id: string };

/** A generic label/value option for selects, radios, and menus. */
export interface Option<TValue = string> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

/** Discriminated result for operations that can fail without throwing. */
export type Result<TData, TError = string> =
  | { ok: true; data: TData }
  | { ok: false; error: TError };
