/**
 * Types mirroring the backend API responses (camelCase).
 *
 * These intentionally duplicate the Pydantic schemas in `backend/app/api/schemas`
 * rather than importing them, because the backend is a separate service.
 */

export interface ApiProblem {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: { field: string; message: string }[];
}

export interface Page<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type UserRole = "patient" | "reception" | "therapist" | "admin";

export interface ApiUser {
  id: string;
  role: UserRole;
  name: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: ApiUser;
}

export interface OtpRequestResult {
  sent: boolean;
  expiresInSeconds: number;
  devCode: string | null;
}

export interface IntakeResult {
  id: string;
  reference: string;
  status: string;
  kind: string;
}

export interface Appointment {
  id: string;
  reference: string;
  patientUserId: string | null;
  professionalId: string;
  serviceSlug: string;
  mode: string;
  startsAt: string;
  endsAt: string;
  status: string;
  location: string | null;
  joinUrl: string | null;
  notes: string | null;
  holdExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  appointmentId: string | null;
  patientUserId: string | null;
  description: string;
  subtotalInr: number;
  taxInr: number;
  totalInr: number;
  currency: string;
  status: string;
  issuedAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  provider: string;
  amountInr: number;
  method: string | null;
  status: string;
  providerPaymentId: string | null;
  createdAt: string;
}

export interface Kpi {
  key: string;
  label: string;
  value: number;
  unit: string | null;
  deltaPct: number | null;
}

export interface TimeseriesPoint {
  day: string;
  value: number;
}

export interface SeoSummary {
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  topPages: { page: string; impressions: number; clicks: number }[];
}

export interface PatientDashboard {
  userId: string;
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  invoices: Invoice[];
  payments: Payment[];
  outstandingInr: number;
  paidInr: number;
  hasRecords: boolean;
}

export interface RecentIntakeRow {
  kind: string;
  id: string;
  reference: string;
  status: string;
  createdAt: string;
}

export interface RecentAuditRow {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  actorRole: string | null;
  createdAt: string;
}

export interface AdminDashboard {
  generatedAt: string;
  rangeFrom: string;
  rangeTo: string;
  kpis: Kpi[];
  appointmentsByStatus: Record<string, number>;
  intakeByKind: Record<string, number>;
  revenueByDay: TimeseriesPoint[];
  engagementByDay: TimeseriesPoint[];
  topPages: { path: string; views: number }[];
  seo: SeoSummary;
  recentIntake: RecentIntakeRow[];
  recentAudit: RecentAuditRow[];
  hasRecords: boolean;
}

export interface AvailabilitySlot {
  professionalId: string;
  mode: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface DocumentItem {
  id: string;
  ownerUserId: string | null;
  appointmentId: string | null;
  kind: string;
  filename: string;
  mime: string | null;
  sizeBytes: number;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  patientUserId: string;
  subject: string;
  status: string;
  lastMessageAt: string | null;
  createdAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderUserId: string | null;
  senderRole: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface StaffUser {
  id: string;
  role: UserRole;
  name: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CheckoutOrder {
  paymentId: string;
  orderId: string;
  keyId: string;
  amount: number;
  currency: string;
  amountInr: number;
}
