# DEPENDENCY_INVENTORY.md

File-by-file status. **Reflects the repository, not intentions.** Last updated
for the Phase 1 public-site build.

Verification for all `[x]` rows: `npx tsc --noEmit` (pass), `npm run lint`
(pass), `npm run build` (pass, 55 routes), and a production `next start` smoke
test returning HTTP 200 for every route (see `AI_CHANGELOG_TEMPLATE.md`).

Legend: `[x]` done & verified · `[ ]` not created · `[~]` partial

## Root / docs

- [x] `README.md`
- [x] `THERAVIVA_MASTER_PROMPT.md`
- [x] `PROJECT_CONTEXT.md`
- [x] `PROFESSIONALS.md`
- [x] `ROADMAP.md`
- [x] `DEPENDENCY_MAP.md`
- [x] `DEPENDENCY_INVENTORY.md`
- [x] `AI_CHANGELOG_TEMPLATE.md`
- [x] `.env.example`

## Types (`src/types/`)

- [x] `common.ts` · `practice.ts` · `content.ts` · `appointment.ts` · `index.ts`

## Config (`src/config/`)

- [x] `site.ts` · `appointment.ts` · `endpoints.ts` · `index.ts`

## Content (`src/data/`)

- [x] `professionals.ts` (both CVs captured)
- [x] `services.ts` (16 services; **prices indicative**)
- [x] `conditions.ts` (15 condition pages)
- [x] `disciplines.ts`
- [x] `pricing.ts` (**packages indicative**)
- [x] `portfolio.ts` (albums + media; **no `src` yet → placeholders**)
- [x] `testimonials.ts` (**empty by design** — real consented reviews only)
- [x] `faqs.ts` · `blog.ts` (4 articles) · `locations.ts` (**address placeholder**)
- [x] `site-content.ts` · `index.ts`

## Library (`src/lib/`)

- [x] `utils.ts` (`cn`) · `format.ts` · `contact.ts` · `analytics.ts` · `seo.ts` · `index.ts`

## Features (`src/features/`)

- [x] `appointments/schema.ts` (zod v4) · `appointments/message.ts` · `appointments/pricing.ts`

## Hooks

- [x] `hooks/useMounted.ts`

## UI primitives (`src/components/ui/`)

- [x] `button` · `input` · `textarea` · `label` · `select` · `checkbox` · `field` · `spinner`
- [x] `card` · `badge` · `alert` · `dialog` · `container` · `section` · `stat`
- [x] `tabs` · `media` · `media-marquee` · `gallery` · `marquee` · `prose` · `index`

## Layout (`src/components/layout/`)

- [x] `site-header` · `top-bar` · `site-footer` · `floating-actions` · `marketing-shell` · `index`

## Marketing sections (`src/components/marketing/`)

- [x] `hero` · `trust-bar` · `services-showcase` · `condition-explorer` · `stats-band`
- [x] `process-steps` · `team-preview` · `portfolio-preview` · `portfolio-explorer`
- [x] `testimonial-wall` · `pricing-preview` · `faq-section` · `cta-band`
- [x] `section-heading` · `breadcrumbs` · `legal-page` · `index`

## Appointment request (`src/components/appointment/`)

- [x] `RequestForm` · `ModeSelector` · `ServiceSelector` · `ProfessionalSelector` · `ContactDetailsForm` · `index`

## Analytics / SEO components

- [x] `analytics/consent-provider` · `analytics/consent-banner` · `analytics/analytics-scripts` · `analytics/index`
- [x] `seo/json-ld`

## Routes (`src/app/`)

- [x] `page.tsx` (home) · `layout.tsx` · `globals.css` · `manifest.ts` · `robots.ts` · `sitemap.ts`
- [x] `(marketing)/layout.tsx`
- [x] `(marketing)/services/page.tsx` · `(marketing)/services/[discipline]/page.tsx`
- [x] `(marketing)/conditions/page.tsx` · `(marketing)/conditions/[slug]/page.tsx`
- [x] `(marketing)/team/page.tsx` · `(marketing)/team/[slug]/page.tsx`
- [x] `(marketing)/portfolio/page.tsx` · `(marketing)/portfolio/[album]/page.tsx`
- [x] `(marketing)/pricing/page.tsx` · `faq/page.tsx`
- [x] `(marketing)/blog/page.tsx` · `(marketing)/blog/[slug]/page.tsx`
- [x] `(marketing)/locations/[city]/page.tsx`
- [x] `(marketing)/contact/page.tsx` · `referral/page.tsx` · `about/page.tsx`
- [x] `(marketing)/legal/{privacy,terms,refund,disclaimer,accessibility}/page.tsx`
- [x] `(booking)/book/layout.tsx` · `(booking)/book/page.tsx`
- [x] `.well-known/security.txt/route.ts` · `.well-known/change-password/route.ts`

## Removed in this phase (demo scaffolding)

These were built against the earlier master prompt and are no longer part of the
product. They were removed deliberately, not lost:

- [x] removed `app/(auth)/*` (in-memory demo login/signup)
- [x] removed `app/(portal)/*` (placeholder patient/professional dashboards)
- [x] removed `app/(booking)/book/{confirmation,cancelled}`
- [x] removed `context/AuthContext`, `context/BookingContext`, `hooks/useAuth`, `hooks/useBooking`
- [x] removed `components/auth/*`, `components/portal/*`
- [x] removed `components/booking/*` (replaced by `components/appointment/*`)
- [x] removed `features/auth/*`, `features/booking/*` (replaced by `features/appointments/*`)
- [x] removed `data/booking.sample.ts` (fake slots)
- [x] removed `types/auth.ts`, `types/booking.ts`
- [x] removed `config/auth.ts`, `config/booking.ts`

## Deliberately NOT implemented (Phase 2+)

- [ ] Backend, database, ORM, migrations
- [ ] Real availability / slot reservation
- [ ] Payment processing (Razorpay)
- [ ] Patient / professional portals, clinical notes
- [ ] WhatsApp / email notification automation
- [ ] CMS for blog/conditions
- [ ] Case studies (consent-gated content pending)

## Outstanding content (blocks launch, not build)

- [ ] Real photos/videos (currently branded placeholders)
- [ ] Confirmed price list (currently indicative)
- [ ] RCI / registration numbers, confirmed languages
- [ ] Real clinic address + pincode + GSTIN
- [ ] Consented testimonials
- [ ] Google Business Profile + NAP consistency
- [ ] Legal pages reviewed by the practice
