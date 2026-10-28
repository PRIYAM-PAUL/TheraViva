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
  IntakeResult,
  OtpRequestResult,
  Page,
  PatientDashboard,
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

  billing: {
    invoices: () => request<Page<unknown>>(API_PATHS.invoices, { auth: true }),
    payments: () => request<Page<unknown>>(API_PATHS.payments, { auth: true }),
  },

  admin: {
    intake: (kind: string, status?: string) => {
      const query = status ? `?status=${encodeURIComponent(status)}` : "";
      return request<Page<Record<string, unknown>>>(`${API_PATHS.adminIntake}/${kind}${query}`, {
        auth: true,
      });
    },
    auditLog: () => request<Page<Record<string, unknown>>>(API_PATHS.auditLog, { auth: true }),
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
