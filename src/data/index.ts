/**
 * Barrel for authored content. Import from `@/data`.
 */

export {
  professionals,
  getProfessionalById,
  getProfessionalBySlug,
} from "./professionals";

export {
  services,
  getServiceBySlug,
  getServicesByDiscipline,
  getServicesByCondition,
} from "./services";

export {
  conditions,
  getConditionBySlug,
  getConditionsByDiscipline,
  getConditionsByProfessional,
} from "./conditions";

export { disciplines, getDiscipline } from "./disciplines";
export type { DisciplineInfo } from "./disciplines";

export { locations, getLocationBySlug, primaryLocation } from "./locations";

export {
  mediaAssets,
  albums,
  getAlbumBySlug,
  getMediaById,
  getMediaForAlbum,
  portfolioDisclaimer,
} from "./portfolio";

export { testimonials, getAverageRating } from "./testimonials";

export { faqs } from "./faqs";

export {
  pricingNotes,
  packages,
  timeWindows,
  pricingDisclaimer,
} from "./pricing";

export {
  blogPosts,
  sortedPosts,
  getPostBySlug,
  getPostsByAuthor,
} from "./blog";

export {
  mission,
  valueProps,
  howItWorks,
  trustSignals,
  sessionModes,
} from "./site-content";
export type { ValueProp, HowItWorksStep } from "./site-content";
