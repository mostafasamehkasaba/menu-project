"use client";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const trimmedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseUrl = trimmedBaseUrl.endsWith("/api")
  ? trimmedBaseUrl.slice(0, -4)
  : trimmedBaseUrl;
const proxyBase = "/api/proxy";

const ACCESS_TOKEN_KEY = "restaurant_access_token";
const REFRESH_TOKEN_KEY = "restaurant_refresh_token";

type ApiError = {
  status: number;
  message: string;
};

const normalizeToken = (value?: string | null) => {
  if (!value) {
    return null;
  }

  let token = value.trim();
  if (
    (token.startsWith("'") && token.endsWith("'")) ||
    (token.startsWith("\"") && token.endsWith("\""))
  ) {
    token = token.slice(1, -1).trim();
  }

  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  return token || null;
};

const getStoredAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return normalizeToken(window.localStorage.getItem(ACCESS_TOKEN_KEY));
};

const getStaticAccessToken = () => {
  return process.env.NEXT_PUBLIC_API_TOKEN ?? null;
};

export const getApiBaseUrl = () => baseUrl;

export const getAccessToken = () => {
  const stored = getStoredAccessToken();
  if (stored) {
    return stored;
  }

  const staticToken = normalizeToken(getStaticAccessToken());
  if (staticToken && typeof window !== "undefined") {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, staticToken);
  }
  return staticToken;
};

export const hasAccessToken = () => Boolean(getAccessToken());

export const setAccessToken = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeToken(token);
  if (normalized) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, normalized);
  }
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

const getStoredRefreshToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return normalizeToken(window.localStorage.getItem(REFRESH_TOKEN_KEY));
};

export const setRefreshToken = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }
  const normalized = normalizeToken(token);
  if (normalized) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, normalized);
  }
};

export const clearRefreshToken = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const buildRequestUrl = (path: string) => {
  const targetPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return `${proxyBase}${targetPath}`;
  }
  if (!baseUrl) {
    return targetPath;
  }
  return `${baseUrl}${targetPath}`;
};

const refreshAccessToken = async () => {
  const refresh = getStoredRefreshToken();
  if (!refresh) {
    clearAccessToken();
    return null;
  }

  const response = await fetch(buildRequestUrl("/api/auth/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearAccessToken();
    clearRefreshToken();
    return null;
  }

  const data = (await response.json()) as { access?: string };
  if (data?.access) {
    setAccessToken(data.access);
    return data.access;
  }
  clearAccessToken();
  clearRefreshToken();
  return null;
};

type ApiFetchOptions = RequestInit & {
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

export const apiFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> => {
  if (!baseUrl) {
    throw new Error("API base URL is missing.");
  }

  const requestUrl = buildRequestUrl(path);

  const headers = new Headers(options.headers);
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (!options.skipAuth && token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(requestUrl, {
    ...options,
    headers,
  });

  if (response.status === 401 && !options.skipRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, skipRefresh: true });
    }
  }

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

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  if (!text) {
    return null as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};
