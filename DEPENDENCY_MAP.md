# DEPENDENCY_MAP.md

Dependency graph for the TheraViva public site (Phase 1). Build bottom-up.

## Layer 0 — Platform

`package.json` · `tsconfig.json` · `eslint.config.mjs` · `next.config.ts` ·
`postcss.config.mjs` · `src/app/layout.tsx` (fonts, metadata, consent provider)

## Layer 1 — Foundation (no UI dependencies)

```
src/types/*        (practice, content, appointment, common)
src/config/*       (site, appointment, endpoints)
src/lib/*          (cn, format, contact, analytics, seo)
src/styles/tokens.css + src/app/globals.css
```

Consumed by everything.

## Layer 2 — Content (`src/data/*`)

```
professionals · services · conditions · disciplines · pricing ·
portfolio · testimonials · faqs · blog · locations · site-content
```

Depends only on `@/types`. Everything else reads from here.

## Layer 3 — UI primitives (`src/components/ui/*`)

```
cn, cva, @base-ui/react, lucide-react, tw-animate-css
   ↓
button, input, textarea, label, select, checkbox, field, spinner,
card, badge, alert, dialog, container, section, stat,
tabs, media, gallery, marquee, prose
```

## Layer 4 — Cross-cutting components

```
analytics/  (consent-provider → consent-banner, analytics-scripts)
seo/        (json-ld)
layout/     (top-bar, site-header, site-footer, floating-actions → marketing-shell)
```

## Layer 5 — Features (`src/features/appointments/*`)

```
schema.ts (zod) · message.ts (WhatsApp/email body) · pricing.ts
```

## Layer 6 — Domain components

```
marketing/*   (hero, trust-bar, services-showcase, condition-explorer,
               stats-band, process-steps, team-preview, portfolio-preview,
               testimonial-wall, pricing-preview, faq-section, cta-band,
               section-heading, breadcrumbs, legal-page)
appointment/* (RequestForm → ModeSelector, ServiceSelector,
               ProfessionalSelector, ContactDetailsForm)
```

## Layer 7 — Routes (`src/app/*`)

```
(marketing)/  services, conditions, team, portfolio, pricing, faq,
              blog, locations, contact, referral, about, legal/*
(booking)/book
home: src/app/page.tsx
metadata routes: robots.ts, sitemap.ts, manifest.ts, .well-known/*
```

Routes compose Layers 2–6. They must not be imported by lower layers.

## Import rules

- `ui/*` must not import from `data/*`, `features/*`, or `components/{marketing,appointment}`.
- `data/*` may import only `@/types`.
- `features/*` may import `@/types`, `@/config`, `@/data`, `@/lib`.
- `components/*` may import `ui/*`, `data/*`, `features/*`, `lib/*`, `config/*`.
- `app/*` composes everything.
- No circular imports. No cross-domain coupling without an agreed contract.

## Verified build order

`types → config → lib → data → ui → analytics/seo → layout → features → marketing/appointment → routes`
