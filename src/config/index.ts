/**
 * Barrel for application configuration. Import from `@/config`.
 */

export {
  siteConfig,
  modeOptions,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY,
} from "./site";
export type { SiteConfig, NavItem } from "./site";

export {
  REQUEST_STEPS,
  MODE_LABELS,
  MODE_DESCRIPTIONS,
  MODE_OPTIONS,
  REQUEST_CONSTRAINTS,
  PREFERRED_DATE_HORIZON_DAYS,
} from "./appointment";
export type { RequestStep } from "./appointment";

export { SERVICE_ENDPOINTS, WELL_KNOWN, STATIC_CACHE_SECONDS } from "./endpoints";

export { apiBaseUrl, isApiConfigured, API_PATHS } from "./api";
