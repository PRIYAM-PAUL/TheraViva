# PROJECT_CONTEXT.md

Durable context for the TheraViva frontend. Read alongside
`THERAVIVA_MASTER_PROMPT.md`. Last rewritten for the **Phase 1 public-site**
build.

## What this project is

A **marketing + portfolio website** for a real, small Delhi-based therapy
practice with two clinicians:

- **MD Irfan** — Occupational Therapist (Paediatrics & Neuro-Rehabilitation)
- **Abhishek Kumar** — Speech Therapist & Audiologist (ASLP)

The practice works offline (clinic + home visits) and online, and wants a site
that showcases their work and lets people request appointments.

See `PROFESSIONALS.md` for the full clinician detail and outstanding verification
items.

## Phase 1 scope (current)

**Frontend only.** No backend, no database, no payments.

- Premium, imagery-led public site with a full SEO surface.
- Portfolio (photos + videos) with a lightbox gallery.
- Appointment **requests** via WhatsApp / email — no persistence, no fake slots.
- Analytics + ads **scaffolding** that stays inert until ids are configured and
  the visitor consents.

Out of scope for now (see `ROADMAP.md`): real availability, Supabase, Razorpay,
patient/doctor portals, WhatsApp reminders.

## Canonical workspace

```
/media/priyam-paul/502C5E772C5E5854/Priyam/TheraViva/TheraViva
```

## Stack (verified)

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16.3.6, App Router, Turbopack |
| UI | React / React DOM 19.2.8 |
| Language | TypeScript ^5 (strict) |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| Icons | lucide-react |
| Primitives | @base-ui/react (Select, Checkbox, Dialog, Tabs) |
| Variants | class-variance-authority |
| Class utils | clsx + tailwind-merge (`cn`) |
| Validation | zod v4 |
| Fonts | Fraunces (display serif) + Geist (UI) |

Path alias: `@/*` → `./src/*`.

## Source layout

```
src/
  app/
    page.tsx                     # homepage (renders MarketingShell)
    (marketing)/                 # public pages (own layout)
      services, conditions, team, portfolio, pricing, faq, blog,
      locations, contact, referral, about, legal/*
    (booking)/book/              # appointment request flow
    .well-known/                 # security.txt, change-password
    robots.ts, sitemap.ts, manifest.ts
  components/
    ui/                          # design-system primitives
    layout/                      # header, footer, shell, floating actions
    marketing/                   # page sections
    appointment/                 # request-flow components
    analytics/                   # consent + analytics scripts
    seo/                         # JSON-LD renderer
  config/                        # site, appointment, endpoints
  data/                          # ALL authored content (see below)
  features/appointments/         # schema, message builder, pricing helpers
  hooks/                         # useMounted
  lib/                           # cn, format, contact, analytics, seo
  styles/tokens.css              # design tokens
  types/                         # domain types
```

## Where content lives

Everything a non-developer would want to change is in `src/data/`:

| File | Contents |
| --- | --- |
| `professionals.ts` | The two clinicians (from their CVs) |
| `services.ts` | 16 services with **indicative** prices |
| `conditions.ts` | 15 condition pages (the SEO backbone) |
| `disciplines.ts` | The three clinical disciplines |
| `pricing.ts` | Packages, time windows, pricing notes |
| `portfolio.ts` | Albums + media (no `src` yet → branded placeholders) |
| `testimonials.ts` | **Empty by design** — real, consented reviews only |
| `faqs.ts` | General practice FAQs |
| `blog.ts` | Four educational articles |
| `locations.ts` | Practice location(s) |
| `site-content.ts` | Mission, value props, how-it-works, trust signals |

## Booking model (no backend)

`/book` is a three-step **request** form (`mode → service → professional →
preferred time → details`). On submit it composes a message and opens **WhatsApp**
or the visitor's **email client**. Nothing is stored, nothing is booked, and no
payment is taken. Copy throughout is explicit about this.

## Design language

Warm, human, premium medical: teal primary over warm **stone** neutrals with a
**sand/amber** accent, soft layered shadows, `Fraunces` display headings, and
generous spacing. Light + dark via `prefers-color-scheme`. WCAG 2.2 AA target.

## SEO

Per-route metadata + canonicals; JSON-LD for `MedicalBusiness`, `WebSite`,
`Physician`, `MedicalCondition`, `FAQPage`, `BreadcrumbList`, `Article`;
dynamic `sitemap.xml`; `robots.txt`; Open Graph + Twitter cards.

## Analytics & ads

`ConsentProvider` gates everything. GA4 (`NEXT_PUBLIC_GA_ID`) and Meta Pixel
(`NEXT_PUBLIC_META_PIXEL_ID`) load **only** when the visitor accepts and the id is
set. `trackContact` / `trackLead` fire the primary conversions.

## Safety and honesty rules

- Never invent testimonials, reviews, prices, availability or confirmations.
- Sample/placeholder content is labelled in the UI (media placeholders say
  "Photo coming soon").
- No PHI in URLs, logs, analytics, or browser storage. Consent storage holds only
  the decision itself.
- Medical disclaimers on condition pages, blog posts and the footer.
