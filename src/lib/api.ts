/**
 * Typed client for the TheraViva backend API.
 *
 * Handles JSON encoding, problem+json error mapping, bearer auth and a single
 * refresh-and-retry on 401. All dashboard reads go through here.
 */

import { API_PATHS, apiBaseUrl } from "@/config/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth";
import type {
  AdminDashboard,
  ApiProblem,
  ApiUser,
  Appointment,
  AvailabilitySlot,
  ChatMessage,
  ChatThread,
  CheckoutOrder,
  DocumentItem,
  IntakeResult,
  Invoice,
  OtpRequestResult,
  Page,
  PatientDashboard,
  Payment,
  StaffUser,
  TokenPair,
} from "@/features/dashboard/types";

export class ApiError extends Error {
  readonly status: number;
  readonly problem: ApiProblem | null;

  constructor(status: number, problem: ApiProblem | null, message?: string) {
    super(message ?? problem?.detail ?? `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  /** Internal: prevents infinite refresh loops. */
  retry?: boolean;
}

async function parseProblem(response: Response): Promise<ApiProblem | null> {
  try {
    const data = (await response.json()) as ApiProblem;
    return typeof data?.title === "string" ? data : null;
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const response = await fetch(`${apiBaseUrl}${API_PATHS.refresh}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!response.ok) {
      clearTokens();
      return false;
    }
    const pair = (await response.json()) as TokenPair;
    setTokens(pair.accessToken, pair.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, retry = true } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, null, "Could not reach the server. Is the backend running?");
  }

  if (response.status === 401 && auth && retry && (await refreshAccessToken())) {
    return request<T>(path, { ...options, retry: false });
  }

  if (response.status === 204) return undefined as T;

  if (!response.ok) {
    throw new ApiError(response.status, await parseProblem(response));
  }
  return (await response.json()) as T;
}

async function authFetch(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, null, "Could not reach the server. Is the backend running?");
  }
  if (response.status === 401 && retry && (await refreshAccessToken())) {
    return authFetch(path, init, false);
  }
  return response;
}

export const api = {
  /** Catalog bootstrap: every content kind in one call. */
  catalog: <T = Record<string, unknown>>() => request<T>(API_PATHS.catalog),

  intake: {
    appointmentRequest: (payload: Record<string, unknown>) =>
      request<IntakeResult>(API_PATHS.appointmentRequests, { method: "POST", body: payload }),
    enquiry: (payload: Record<string, unknown>) =>
      request<IntakeResult>(API_PATHS.enquiries, { method: "POST", body: payload }),
    referral: (payload: Record<string, unknown>) =>
      request<IntakeResult>(API_PATHS.referrals, { method: "POST", body: payload }),
  },

  auth: {
    requestOtp: (phone: string) =>
      request<OtpRequestResult>(API_PATHS.otpRequest, { method: "POST", body: { phone } }),
    verifyOtp: (phone: string, code: string, name?: string) =>
      request<TokenPair>(API_PATHS.otpVerify, {
        method: "POST",
        body: { phone, code, ...(name ? { name } : {}) },
      }),
    staffLogin: (email: string, password: string) =>
      request<TokenPair>(API_PATHS.staffLogin, { method: "POST", body: { email, password } }),
    logout: async () => {
      const refresh = getRefreshToken();
      if (refresh) {
        await request<void>(API_PATHS.logout, {
          method: "POST",
          body: { refreshToken: refresh },
        }).catch(() => undefined);
      }
      clearTokens();
    },
    me: () => request<ApiUser>(API_PATHS.me, { auth: true }),
  },

  dashboard: {
    patient: () => request<PatientDashboard>(API_PATHS.patientDashboard, { auth: true }),
    admin: (from?: string, to?: string) => {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const query = params.toString();
      return request<AdminDashboard>(`${API_PATHS.adminDashboard}${query ? `?${query}` : ""}`, {
        auth: true,
      });
    },
  },

  appointments: {
    availability: (professionalId: string, mode: string, from?: string, to?: string) => {
      const params = new URLSearchParams({ professional: professionalId, mode });
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      return request<AvailabilitySlot[]>(`${API_PATHS.availability}?${params.toString()}`);
    },
    list: (params: { status?: string; professional?: string } = {}) => {
      const query = new URLSearchParams();
      if (params.status) query.set("status", params.status);
      if (params.professional) query.set("professional", params.professional);
      const qs = query.toString();
      return request<Page<Appointment>>(`${API_PATHS.appointments}${qs ? `?${qs}` : ""}`, {
        auth: true,
      });
    },
    create: (payload: Record<string, unknown>) =>
      request<Appointment>(API_PATHS.appointments, { method: "POST", body: payload, auth: true }),
    cancel: (reference: string) =>
      request<Appointment>(`${API_PATHS.appointments}/${reference}/cancel`, {
        method: "POST",
        auth: true,
      }),
    updateStatus: (reference: string, status: string, note?: string) =>
      request<Appointment>(`${API_PATHS.appointments}/${reference}/status`, {
        method: "PATCH",
        body: { status, ...(note ? { note } : {}) },
        auth: true,
      }),
  },

  documents: {
    list: (kind?: string) => {
      const qs = kind ? `?kind=${encodeURIComponent(kind)}` : "";
      return request<Page<DocumentItem>>(`${API_PATHS.documents}${qs}`, { auth: true });
    },
    upload: async (
      file: File,
      meta: { kind?: string; appointmentId?: string; ownerUserId?: string } = {},
    ): Promise<DocumentItem> => {
      const form = new FormData();
      form.append("file", file);
      if (meta.kind) form.append("kind", meta.kind);
      if (meta.appointmentId) form.append("appointmentId", meta.appointmentId);
      if (meta.ownerUserId) form.append("ownerUserId", meta.ownerUserId);
      const response = await authFetch(API_PATHS.documents, { method: "POST", body: form });
      if (!response.ok) throw new ApiError(response.status, await parseProblem(response));
      return (await response.json()) as DocumentItem;
    },
    /** Fetch an authenticated download and return a temporary object URL. */
    objectUrl: async (id: string): Promise<string> => {
      const response = await authFetch(`${API_PATHS.documents}/${id}`);
      if (!response.ok) throw new ApiError(response.status, await parseProblem(response));
      return URL.createObjectURL(await response.blob());
    },
  },

  chat: {
    threads: () => request<Page<ChatThread>>(API_PATHS.chatThreads, { auth: true }),
    createThread: (subject: string) =>
      request<ChatThread>(API_PATHS.chatThreads, {
        method: "POST",
        body: { subject },
        auth: true,
      }),
    messages: (threadId: string, after?: string) => {
      const qs = after ? `?after=${encodeURIComponent(after)}` : "";
      return request<ChatMessage[]>(`${API_PATHS.chatThreads}/${threadId}/messages${qs}`, {
        auth: true,
      });
    },
    post: (threadId: string, body: string) =>
      request<ChatMessage>(`${API_PATHS.chatThreads}/${threadId}/messages`, {
        method: "POST",
        body: { body },
        auth: true,
      }),
    markRead: (threadId: string) =>
      request<{ markedRead: number }>(`${API_PATHS.chatThreads}/${threadId}/read`, {
        method: "POST",
        auth: true,
      }),
  },

  billing: {
    invoices: () => request<Page<Invoice>>(API_PATHS.invoices, { auth: true }),
    payments: (invoiceId?: string) => {
      const qs = invoiceId ? `?invoiceId=${encodeURIComponent(invoiceId)}` : "";
      return request<Page<Payment>>(`${API_PATHS.payments}${qs}`, { auth: true });
    },
    createInvoice: (payload: { description: string; totalInr: number; patientUserId?: string }) =>
      request<Invoice>(API_PATHS.invoices, { method: "POST", body: payload, auth: true }),
    recordPayment: (payload: {
      invoiceId: string;
      amountInr: number;
      method?: string;
      note?: string;
    }) => request<Payment>(API_PATHS.payments, { method: "POST", body: payload, auth: true }),
    refund: (payload: { paymentId: string; amountInr: number; reason?: string }) =>
      request<Record<string, unknown>>(API_PATHS.refunds, {
        method: "POST",
        body: payload,
        auth: true,
      }),
    startCheckout: (invoiceId: string, amountInr?: number) =>
      request<CheckoutOrder>(API_PATHS.checkoutOrder, {
        method: "POST",
        body: { invoiceId, ...(amountInr ? { amountInr } : {}) },
        auth: true,
      }),
    verifyCheckout: (payload: {
      paymentId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }) => request<Payment>(API_PATHS.checkoutVerify, { method: "POST", body: payload, auth: true }),
  },

  admin: {
    intake: (kind: string, status?: string) => {
      const query = status ? `?status=${encodeURIComponent(status)}` : "";
      return request<Page<Record<string, unknown>>>(`${API_PATHS.adminIntake}/${kind}${query}`, {
        auth: true,
      });
    },
    updateIntake: (kind: string, id: string, status: string) =>
      request<Record<string, unknown>>(`${API_PATHS.adminIntake}/${kind}/${id}`, {
        method: "PATCH",
        body: { status },
        auth: true,
      }),
    auditLog: () => request<Page<Record<string, unknown>>>(API_PATHS.auditLog, { auth: true }),
    patients: () => request<Page<StaffUser>>(API_PATHS.staffPatients, { auth: true }),
    users: () => request<Page<StaffUser>>(API_PATHS.adminUsers, { auth: true }),
    createUser: (payload: { email: string; password: string; role: string; name?: string }) =>
      request<StaffUser>(API_PATHS.adminUsers, { method: "POST", body: payload, auth: true }),
    updateUser: (
      id: string,
      payload: { name?: string; role?: string; isActive?: boolean; password?: string },
    ) =>
      request<StaffUser>(`${API_PATHS.adminUsers}/${id}`, {
        method: "PATCH",
        body: payload,
        auth: true,
      }),
  },

  engagement: {
    record: (payload: Record<string, unknown>) =>
      request<{ id: string; recorded: boolean }>(API_PATHS.engagement, {
        method: "POST",
        body: payload,
      }),
  },
};

export { apiBaseUrl };
