# TheraViva

Marketing and portfolio website for a Delhi-based therapy practice offering
**occupational therapy**, **speech & language therapy**, and **audiology** for
children and adults.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

> **Phase 1 built the public site; the platform layer is now in place.** The
> marketing site is SEO-ready and static. A Starlette + SQLite backend
> (`backend/`) persists bookings, prescriptions, chat and payments, and powers
> the patient dashboard (`/dashboard`), the staff area (`/staff`) and the admin
> overview (`/admin`). Razorpay runs in test mode. Media is still placeholder
> content and prices are indicative.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # dev server (Turbopack)
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
npx tsc --noEmit  # type-check
```

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16.3.6 (App Router, Turbopack) |
| UI | React 19.2.8 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| Icons | lucide-react |
| Primitives | @base-ui/react |
| Variants | class-variance-authority |
| Class utils | clsx + tailwind-merge (`cn`) |
| Validation | zod v4 |
| Fonts | Fraunces (display) + Geist (UI) |

## Routes

| Path | Description |
| --- | --- |
| `/` | Homepage |
| `/services`, `/services/[discipline]` | Services hub and per-discipline pages |
| `/conditions`, `/conditions/[slug]` | 15 condition pages |
| `/team`, `/team/[slug]` | Team hub and professional profiles |
| `/portfolio`, `/portfolio/[album]` | Media gallery and collections |
| `/pricing` | Fees and packages |
| `/faq` | Frequently asked questions |
| `/blog`, `/blog/[slug]` | Articles |
| `/locations/[city]` | Location page |
| `/contact`, `/referral` | Contact and professional referrals |
| `/about` | About the practice |
| `/book` | Booking: real slots (signed in) or a persisted request |
| `/login` | Sign in — patient phone OTP or staff password |
| `/dashboard` | Patient overview (appointments, invoices, payments) |
| `/dashboard/appointments` | All bookings, cancel |
| `/dashboard/prescriptions` | Upload + view prescriptions/reports |
| `/dashboard/messages` | Chat with the clinic |
| `/dashboard/help` | Searchable FAQs |
| `/staff` | Staff home (role-scoped) |
| `/staff/appointments` | Confirm/complete/cancel appointments |
| `/staff/intake` | Triage requests, enquiries, referrals |
| `/staff/payments` | Invoices, payments, refunds, online checkout |
| `/staff/patients` | Patient list |
| `/staff/messages` | Clinic inbox |
| `/staff/analytics` | KPIs + Grafana (admin) |
| `/staff/users` | Staff accounts (admin) |
| `/admin` | Admin overview (KPIs, revenue, engagement, SEO) |
| `/legal/*` | Privacy, terms, refunds, disclaimer, accessibility |

## Editing content

All authored content lives in `src/data/` — clinicians, services, conditions,
pricing, portfolio, FAQs, blog posts and site copy. Site identity (name, contact
details, hours, navigation) is in `src/config/site.ts`.

See `PROFESSIONALS.md` for the clinicians' full details and the list of items
that still need verification.

## Documentation

- [`THERAVIVA_MASTER_PROMPT.md`](./THERAVIVA_MASTER_PROMPT.md) — working rules
- [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) — architecture and design context
- [`PROFESSIONALS.md`](./PROFESSIONALS.md) — clinician records + verification list
- [`ROADMAP.md`](./ROADMAP.md) — phased plan (Phase 1 built; 2–6 planned)
- [`DEPENDENCY_MAP.md`](./DEPENDENCY_MAP.md) — dependency graph
- [`DEPENDENCY_INVENTORY.md`](./DEPENDENCY_INVENTORY.md) — file-by-file status
- [`AI_CHANGELOG_TEMPLATE.md`](./AI_CHANGELOG_TEMPLATE.md) — change log
- [`.env.example`](./.env.example) — environment variable placeholders
- [`backend/README.md`](./backend/README.md) — the Starlette + SQLite backend and dashboards

## Backend

A separate service in [`backend/`](./backend) (Starlette + ASGI/uvicorn, SQLite
via SQLAlchemy 2.0 async, Pydantic v2, JWT auth) persists appointment requests,
enquiries and referrals, serves the authored content as an API, and powers the
patient and practice-admin dashboards at `/dashboard` and `/admin`.

```bash
cd backend
uv sync --all-groups
uv run uvicorn app.main:app --reload   # http://localhost:8000
```

Point the frontend at it with `NEXT_PUBLIC_API_URL` (see `.env.example`). See
[`backend/README.md`](./backend/README.md) for endpoints, providers, tests and
design notes.

### Staff logins (development defaults)

Created on first startup; change them in production.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@theraviva.local` | `admin12345` |
| Reception | `reception@theraviva.local` | `reception12345` |
| Therapist | `therapist@theraviva.local` | `therapist12345` |

Patients sign in with phone OTP; in development the code is always `123456`.

### Observability (optional)

`docker compose up -d` starts Prometheus (scraping the backend `/metrics`) and
Grafana on `http://localhost:3001` with a provisioned "TheraViva overview" board.
Point the frontend at it with `NEXT_PUBLIC_GRAFANA_URL` and
`NEXT_PUBLIC_GRAFANA_DASHBOARD_UID`.

## Environment

Copy `.env.example` to `.env.local`. Analytics are inert until ids are set **and**
a visitor consents.
