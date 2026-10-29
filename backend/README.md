# TheraViva Backend

Backend for the TheraViva therapy-practice platform: a **Starlette + ASGI
(uvicorn)** service over **SQLite** (SQLAlchemy 2.0 async + Alembic), with
Pydantic v2 validation, JWT auth and dashboard analytics.

> The frontend (`../src`) is the marketing site. This service persists
> appointment requests, enquiries and referrals, exposes the authored content
> as an API, and provides patient + admin dashboards. It does not invent
> availability, prices or payment outcomes.

## Quick start

```bash
cd backend
uv sync --all-groups
cp .env.example .env
uv run python -m scripts.seed          # seed catalog from app/seed/content.json
uv run uvicorn app.main:app --reload   # http://localhost:8000
```

Regenerate the content snapshot from the frontend whenever `src/data/*` changes:

```bash
npx --yes tsx scripts/export_frontend_data.mjs
```

## Endpoints

| Path | Purpose |
| --- | --- |
| `GET /healthz` | Liveness |
| `GET /readyz` | Readiness (database ping) |
| `GET /version` | Build/version info |
| `GET /metrics` | Prometheus metrics |
| `GET /.well-known/security.txt` | RFC 9116 |
| `GET /.well-known/change-password` | RFC 8615 (redirect) |
| `GET /api/v1/catalog` | All catalog content in one payload |
| `GET /api/v1/services`, `/conditions`, `/professionals`, … | Catalog aliases |
| `POST /api/v1/intake/appointment-requests` | Persist an appointment request |
| `POST /api/v1/intake/enquiries` | General enquiry |
| `POST /api/v1/intake/referrals` | Professional referral |
| `POST /api/v1/auth/otp/request`, `/otp/verify` | Patient phone-OTP login |
| `POST /api/v1/auth/staff/login` | Staff login (reception / therapist / admin) |
| `GET /api/v1/availability` | Generated slots (weekly rules, IST → UTC) |
| `POST /api/v1/appointments` | Book a slot (hold or request) |
| `POST /api/v1/appointments/{ref}/cancel` | Patient/staff self-service cancel |
| `GET/POST /api/v1/billing/invoices`, `/payments`, `/refunds` | Billing |
| `POST /api/v1/billing/payments/razorpay/order`, `/verify` | Razorpay checkout (test/live) |
| `POST /api/v1/webhooks/razorpay` | Signature-verified payment webhook |
| `GET/POST /api/v1/documents` | Prescription/report upload + listing |
| `GET/POST /api/v1/chat/threads`, `/{id}/messages`, `/read` | Patient ↔ clinic chat |
| `POST /api/v1/analytics/events` | Engagement beacon (privacy-safe) |
| `GET /api/v1/dashboard/patient` | Patient dashboard |
| `GET /api/v1/dashboard/admin` | Admin dashboard (KPIs, revenue, SEO) |
| `GET /api/v1/admin/intake/{kind}`, `/audit-log`, `/users` | Admin |
| `GET/POST/PATCH /api/v1/admin/users` | Staff account management (admin) |
| `GET /api/v1/staff/patients` | Patient list (any staff) |

The public request payload mirrors the frontend's zod schema exactly
(camelCase, e.g. `serviceSlug`, `preferredDate`).

## Providers — free and open source

Selected by environment variables; every provider has a local/no-cost default.

| Need | Default | Production option |
| --- | --- | --- |
| Payments | `manual` (records offline payments) | `razorpay` (test/live) or `fake` for tests |
| Email | `fake` (logs) | `smtp` → any relay, incl. self-hosted **Postal** (MIT) |
| WhatsApp | `fake` (logs) | `waha` → self-hosted **WAHA** (Apache-2.0) |
| SMS/OTP | `console` | `fake` for tests; plug in any sender |

**Razorpay.** Set `THERAVIVA_PAYMENT_PROVIDER=razorpay` plus
`THERAVIVA_RAZORPAY_KEY_ID`, `THERAVIVA_RAZORPAY_KEY_SECRET` and
`THERAVIVA_RAZORPAY_WEBHOOK_SECRET`. Payments are captured only after a verified
Checkout signature or webhook — never fabricated. Use test-mode keys first.

**Caveats.** WAHA is *unofficial* (WhatsApp Web automation) — use it only for
opt-in, rate-limited transactional messages. Hyperswitch is an *orchestrator*
(software is free; it still needs a PSP/acquirer account). Self-hosted email
needs SPF/DKIM/PTR.

## Testing

```bash
uv run pytest                 # full suite
uv run pytest --cov=app       # with coverage
uv run ruff check .           # lint
uv run mypy app               # types
./scripts/smoke.sh            # boots uvicorn and exercises real HTTP
```

## Design notes

- **Layers**: routes → services → repositories/models. Routes never query the
  ORM directly; services own transactions.
- **Catalog** is stored as a discriminated table with a JSON payload (content is
  read-mostly and mirrors the frontend objects); scalar columns are lifted out
  only where the API filters.
- **Money** is whole rupees (`*_inr`); GST is extracted from GST-inclusive
  totals (`app/utils/gst.py`).
- **Privacy**: IPs are salted-hashed, never logged; the logging filter redacts
  emails, phones and known sensitive keys. No PHI in URLs or analytics.
- **Auth**: four roles — `patient` (phone OTP), and `reception`, `therapist`,
  `admin` (password). Authorization is centralised in `require_role`. Access
  tokens are short-lived JWTs; refresh tokens are opaque, hashed and rotated.
