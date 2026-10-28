import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, api, apiBaseUrl } from "@/lib/api";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/auth";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  clearTokens();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("token storage", () => {
  it("stores and clears the token pair", () => {
    setTokens("access-1", "refresh-1");
    expect(getAccessToken()).toBe("access-1");
    expect(getRefreshToken()).toBe("refresh-1");
    clearTokens();
    expect(getAccessToken()).toBeNull();
  });
});

describe("api client", () => {
  it("posts a staff login and returns the token pair", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        accessToken: "a",
        refreshToken: "r",
        tokenType: "bearer",
        expiresIn: 1800,
        user: { id: "1", role: "admin" },
      }),
    );

    const result = await api.auth.staffLogin("admin@theraviva.local", "secret123");

    expect(result.accessToken).toBe("a");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${apiBaseUrl}/api/v1/auth/staff/login`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      email: "admin@theraviva.local",
      password: "secret123",
    });
  });

  it("maps a problem+json error to ApiError", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        { type: "t", title: "Not found", status: 404, detail: "No such thing", instance: "/x" },
        404,
      ),
    );

    await expect(api.catalog()).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "No such thing",
    });
  });

  it("refreshes once on 401 then retries the request", async () => {
    setTokens("expired", "refresh-1");

    fetchMock
      // 1. initial request → 401
      .mockResolvedValueOnce(jsonResponse({ title: "unauthorized" }, 401))
      // 2. refresh → new pair
      .mockResolvedValueOnce(
        jsonResponse({
          accessToken: "fresh",
          refreshToken: "refresh-2",
          tokenType: "bearer",
          expiresIn: 1800,
          user: { id: "1", role: "admin" },
        }),
      )
      // 3. retried request → user
      .mockResolvedValueOnce(jsonResponse({ id: "1", role: "admin", name: "Admin" }));

    const user = await api.auth.me();

    expect(user.id).toBe("1");
    expect(getAccessToken()).toBe("fresh");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1][0]).toBe(`${apiBaseUrl}/api/v1/auth/token/refresh`);
  });

  it("surfaces a network failure as a friendly ApiError", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const error = await api.catalog().catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(0);
    expect((error as ApiError).message).toMatch(/backend running/i);
  });
});
