# AI_CHANGELOG_TEMPLATE.md

Record every completed change here. One entry per target file. Newest entries at the top.
This file documents **work performed**, not intentions. Never mark something "verified" unless it was actually run.

---

## Template — copy for each entry

```
### <YYYY-MM-DD> — <file path>

- **Entity / layer**: <e.g. Booking / components>
- **Action**: created | updated | refactored | fixed
- **Role**: <what this file does>
- **Depends on**: <imports / upstream files>
- **Consumed by**: <downstream files, if known>
- **Change summary**: <what changed>
- **Preserved**: <what was intentionally left unchanged>
- **Validation**: <commands run + actual result, or "not run">
- **Integration notes**: <mismatches deferred, dependencies incomplete>
- **Next file**: <exact path>
```

---

## Entries

### 2026-10-26 — Portfolio doctor navbar, media marquee, and CV quality check

- **Entity / layer**: portfolio + professionals content
- **Action**: created + updated
- **Role**: Added a doctor filter navbar and a modern auto-scrolling media strip to the portfolio; verified the captured CV data line-by-line against the source CVs.
- **Change summary**: New `components/ui/media-marquee.tsx` (seamless duplicated track, pause on hover/focus, `prefers-reduced-motion` safe, optional reverse). New `components/marketing/portfolio-explorer.tsx` — a doctor "navbar" (All work / MD Irfan / Abhishek Kumar) that filters an auto-scrolling media marquee, a scrolling keyword band, the album collections and the full lightbox gallery. `MediaFrame` gained a `controls` prop so marquee videos are non-interactive. Homepage portfolio section now uses the marquee + keyword band. Client components switched to direct data-module imports (avoids pulling `conditions.ts` into the client bundle).
- **CV quality check**: restored 3 dropped skills for MD Irfan and 3 condensed skills for Abhishek; normalised spelling to British English; documented two inferences (stuttering + hearing loss for Abhishek) as **unverified**; noted the unverified LinkedIn handle and the empty "Achievement" heading. Findings recorded in `PROFESSIONALS.md`.
- **Validation**: `npx tsc --noEmit` → pass. `npm run lint` → pass. `npm run build` → pass. Smoke test → 200 on `/`, `/portfolio`, `/portfolio/audiology`, `/team/*`, `/conditions/stuttering`, `/pricing`. Confirmed the doctor navbar renders (`Filter portfolio by specialist`, both names) and 2 marquees animate on `/portfolio`.

### 2026-10-26 — Phase 1 rebuild: real practice platform (public site)

- **Entity / layer**: whole project (pivot from demo → real practice website)
- **Action**: created + removed + refactored
- **Role**: Rebuilt the site around the two real clinicians (MD Irfan — occupational therapy; Abhishek Kumar — speech & audiology) with a premium, SEO-ready, frontend-only public site.
- **Depends on**: same stack (Next 16.3.6, React 19.2.8, Tailwind v4, Base UI, cva, zod v4) + Fraunces display font.
- **Change summary**: New domain types (`practice`, `content`, `appointment`); authored content for 2 professionals, 16 services, 15 condition pages, 5 portfolio albums, 4 blog articles, pricing, FAQs, locations. New design tokens (warm stone + sand), new UI primitives (tabs, media, gallery/lightbox, marquee, prose, stat). New layout chrome (top bar, header with WhatsApp, footer with NAP, sticky mobile action bar). New marketing sections and 25+ routes. Consent-gated GA4/Meta Pixel scaffolding. SEO: per-route metadata, canonicals, JSON-LD (MedicalBusiness, WebSite, Physician, MedicalCondition, FAQPage, BreadcrumbList, Article), dynamic sitemap, robots. Appointment **request** flow via WhatsApp/email replaces the fake booking wizard.
- **Removed**: demo auth, portal, and booking-context scaffolding (in-memory sessions, fake slots, placeholder dashboards) — see `DEPENDENCY_INVENTORY.md`.
- **Preserved**: `cn` + formatters, `.well-known` routes, robots/sitemap/manifest, docs pack.
- **Validation**: `npx tsc --noEmit` → pass. `npm run lint` → pass (0 errors, 0 warnings). `npm run build` → pass (55 routes). `npm run start` smoke test → HTTP 200 for all 31 sampled routes. Verified JSON-LD renders (`MedicalBusiness`, `WebSite`, `Physician`, `MedicalCondition`, `FAQPage`, `BreadcrumbList`), canonical links and titles resolve. No errors in the server log.
- **Integration notes**: No backend exists — `/book` composes a WhatsApp/email message; nothing is persisted. Prices are indicative; media are branded placeholders; testimonials are intentionally empty.
- **Next file**: content swap (`src/data/*`) once the practice supplies media, prices and registration numbers.

### 2026-10-26 — Bootstrap session (initial build)

- **Entity / layer**: whole project (foundation → booking → auth → marketing → portals)
- **Action**: created
- **Role**: Built the TheraViva frontend from an empty `create-next-app` scaffold.
- **Depends on**: `next@16.3.6`, `react@19.2.8`, Tailwind v4, `lucide-react`, `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `zod@4`.
- **Change summary**: Installed the full stack; created the docs pack, design tokens, UI primitives, layout shells, and the Booking, Auth, Marketing, and Portal entities plus standards routes (`robots`, `sitemap`, `manifest`, `.well-known/security.txt`, `.well-known/change-password`).
- **Preserved**: Root layout font setup and `LayoutProps<"/">`; the create-next-app project scaffolding and config.
- **Validation**: `npx tsc --noEmit` → pass. `npm run lint` → pass. `npm run build` → pass (19 routes). `npm run start` smoke test → HTTP 200 for `/`, `/services`, `/about`, `/contact`, `/book`, `/login`, `/signup`, `/portal`, `/pro`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/.well-known/security.txt`; `/.well-known/change-password` → 302 to `/login`. No errors in the server log.
- **Integration notes**: No backend exists — booking/auth are frontend demonstrations. `openid-configuration` / `oauth-authorization-server` / `jwks.json` are reserved path constants only (not served) to avoid fabricating API behaviour.
- **Next file**: awaiting user direction (e.g. a verified API contract, or additional entities such as a clinician directory or resources/blog).

### 2026-10-26 — `src/app/(booking)/book/page.tsx`

- **Entity / layer**: Booking / route integration
- **Action**: created
- **Role**: Four-stage booking flow (service → schedule → details → review) wired to `BookingContext`.
- **Depends on**: `components/booking/*`, `data/booking.sample.ts`, `hooks/useBooking`, `hooks/useMounted`, `config/booking`.
- **Change summary**: Resolved the previously-noted integration hazards — stepper uses the canonical `{id,label,description?}` model; the page owns the only `<form>` (no nested form); state is driven by the reducer/context rather than loose page state; `DateSelector` month navigation uses explicit parent state; date-dependent rendering is gated by `useMounted` to avoid hydration mismatches.
- **Validation**: included in the session build/lint/type-check and the `next start` smoke test.
- **Integration notes**: Submission records a clearly-labelled, non-authoritative local result (`demo: true`); no server call is made.

### 2026-10-26 — `src/hooks/useMounted.ts`

- **Entity / layer**: shared hooks
- **Action**: created
- **Role**: Client-mount detection for hydration-safe rendering.
- **Change summary**: Implemented with `useSyncExternalStore` (server snapshot `false`) instead of `setState` in an effect, satisfying `react-hooks/set-state-in-effect`.
- **Validation**: `npm run lint` → pass.

