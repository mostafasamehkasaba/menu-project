"use client";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

const ACCESS_TOKEN_KEY = "restaurant_access_token";

type ApiError = {
  status: number;
  message: string;
};

const getStoredAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getStaticAccessToken = () => {
  return process.env.NEXT_PUBLIC_API_TOKEN ?? null;
};

export const getApiBaseUrl = () => baseUrl;

export const setAccessToken = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  if (!baseUrl) {
    throw new Error("API base URL is missing.");
  }

  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredAccessToken() ?? getStaticAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = response.statusText || "Request failed";
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload?.detail) {
        message = payload.detail;
      }
    } catch {
      // ignore body parsing errors
    }
    const error: ApiError = { status: response.status, message };
    throw error;
  }

  return (await response.json()) as T;
};
