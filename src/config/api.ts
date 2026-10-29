/**
 * Backend API configuration.
 *
 * `NEXT_PUBLIC_API_URL` is the origin of the Starlette backend (see
 * `backend/README.md`). It must be a `NEXT_PUBLIC_*` variable to be readable in
 * the browser. When unset, the dashboards fall back to a local dev server and
 * show a clear "not configured" state in production.
 */

const configured = process.env.NEXT_PUBLIC_API_URL;

export const apiBaseUrl: string = (configured ?? "http://localhost:8000").replace(/\/+$/, "");

/** True when the API origin has been explicitly configured. */
export const isApiConfigured: boolean = Boolean(configured);

export const API_PATHS = {
  catalog: "/api/v1/catalog",
  appointmentRequests: "/api/v1/intake/appointment-requests",
  enquiries: "/api/v1/intake/enquiries",
  referrals: "/api/v1/intake/referrals",
  otpRequest: "/api/v1/auth/otp/request",
  otpVerify: "/api/v1/auth/otp/verify",
  staffLogin: "/api/v1/auth/staff/login",
  refresh: "/api/v1/auth/token/refresh",
  logout: "/api/v1/auth/logout",
  me: "/api/v1/auth/me",
  patientDashboard: "/api/v1/dashboard/patient",
  adminDashboard: "/api/v1/dashboard/admin",
  invoices: "/api/v1/billing/invoices",
  payments: "/api/v1/billing/payments",
  refunds: "/api/v1/billing/refunds",
  checkoutOrder: "/api/v1/billing/payments/razorpay/order",
  checkoutVerify: "/api/v1/billing/payments/razorpay/verify",
  adminIntake: "/api/v1/admin/intake",
  auditLog: "/api/v1/admin/audit-log",
  adminUsers: "/api/v1/admin/users",
  staffPatients: "/api/v1/staff/patients",
  availability: "/api/v1/availability",
  appointments: "/api/v1/appointments",
  documents: "/api/v1/documents",
  chatThreads: "/api/v1/chat/threads",
  engagement: "/api/v1/analytics/events",
  seo: "/api/v1/analytics/seo",
} as const;
