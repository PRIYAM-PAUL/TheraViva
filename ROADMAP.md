# ROADMAP.md

Phased plan for the TheraViva practice platform. Phase 1 is built; later phases
are documented but **not** implemented.

---

## Phase 1 — Premium marketing + portfolio ✅ BUILT

Frontend only. No backend.

- [x] Design system v2 (warm premium-medical palette, Fraunces + Geist)
- [x] Homepage with video/image-ready hero, trust bar, stats, condition explorer
- [x] Services hub + per-discipline pages
- [x] **15 condition pages** (SEO backbone)
- [x] Team hub + two full professional profiles (from CVs)
- [x] Portfolio with albums + keyboard-accessible lightbox
- [x] Pricing page with per-service/per-mode fees + packages
- [x] Blog (4 articles, static content)
- [x] FAQ, Contact, Referral, About, Location page
- [x] Legal pages (privacy, terms, refunds, disclaimer, accessibility)
- [x] Appointment **request** flow via WhatsApp / email
- [x] SEO: metadata, canonicals, JSON-LD, sitemap, robots, OG
- [x] Analytics/ads scaffolding gated by consent
- [x] RFC 8615 `.well-known` routes (security.txt, change-password)

### Phase 1 — outstanding content work

- [ ] Replace **placeholder media** with real photos/videos (consent required)
- [ ] Replace **indicative prices** with the practice's confirmed price list
- [ ] Confirm **languages** and add **RCI / registration numbers**
- [ ] Add the real **clinic address**, pincode and GSTIN
- [ ] Publish **consented testimonials** (`src/data/testimonials.ts`)
- [ ] Create and verify the **Google Business Profile**; keep NAP identical
- [ ] Have the **legal pages reviewed** (they are templates)
- [ ] Configure `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` if wanted

---

## Phase 2 — Real booking + payments

Requires a backend.

- Supabase (Postgres + Auth + Storage, Mumbai region) + Drizzle
- Real availability: recurring rules + exceptions per professional and mode
- Slot hold → confirm → reminder; reschedule/cancel via signed token link
- Patient auth via **phone OTP** (India-first)
- **Razorpay** payments (UPI/cards/netbanking), pay-now or pay-at-clinic, GST invoices
- WhatsApp Cloud API + Resend confirmations and 24h/1h reminders
- ICS / Google Calendar links; Zoom/Meet link per appointment (manual at first)
- Replace the request form with real booking (keep the request form as a fallback)

## Phase 3 — Portals + CRM

- Patient portal: appointments, payments, invoices, documents, join link
- Doctor dashboard: schedule, availability editor, patient list, clinical notes (SOAP), earnings
- Admin: services, pricing, media, blog, payments, refunds, audit log
- RBAC + Postgres RLS on every table

## Phase 4 — Content engine + SEO scale

- CMS (Sanity or Payload) so the practice can publish blog/conditions
- Case studies (consent-gated), video testimonials
- City/area landing pages (only where genuinely served)
- Reviews engine → Google reviews
- Multi-language (Hindi) with hreflang, if wanted

## Phase 5 — Ads + automation

- Google Ads (Search + Performance Max) with per-service/per-city landing pages
- Meta Ads + Conversions API (server-side)
- Call tracking, UTM capture into the DB
- Recall / follow-up automation for ongoing therapy

## Phase 6 — Scale

- Multi-clinic, multi-therapist
- Subscriptions / session packages with credits
- GST reporting, invoices, payouts
- Optional mobile app

---

## Explicitly NOT done in Phase 1

- No database, no authentication, no payment processing
- No persisted patient records or clinical notes
- No real availability or slot reservation
- No fake `fetch` calls or guessed API endpoints
