"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  apiFetch,
  hasAccessToken,
  setAccessToken,
  setRefreshToken,
} from "../services/api-client";

type LoginResponse = Record<string, unknown>;

type ExtractedTokens = {
  accessToken?: string;
  refreshToken?: string;
  message?: string;
};

const pickTokens = (value: unknown): ExtractedTokens => {
  if (!value || typeof value !== "object") {
    return {};
  }

  const data = value as Record<string, unknown>;

  const accessToken =
    (typeof data.access === "string" && data.access) ||
    (typeof data.access_token === "string" && data.access_token) ||
    (typeof data.token === "string" && data.token) ||
    (typeof data.jwt === "string" && data.jwt) ||
    undefined;

  const refreshToken =
    (typeof data.refresh === "string" && data.refresh) ||
    (typeof data.refresh_token === "string" && data.refresh_token) ||
    undefined;

  const message =
    (typeof data.detail === "string" && data.detail) ||
    (typeof data.message === "string" && data.message) ||
    (typeof data.error === "string" && data.error) ||
    undefined;

  return { accessToken, refreshToken, message };
};

const extractTokens = (response: unknown): ExtractedTokens => {
  if (typeof response === "string") {
    try {
      return extractTokens(JSON.parse(response));
    } catch {
      return { message: response };
    }
  }

  const primary = pickTokens(response);
  if (primary.accessToken) {
    return primary;
  }

  if (response && typeof response === "object") {
    const data = (response as Record<string, unknown>).data;
    const nested = pickTokens(data);
    if (nested.accessToken || nested.message || nested.refreshToken) {
      return nested;
    }

    const tokens = (response as Record<string, unknown>).tokens;
    const nestedTokens = pickTokens(tokens);
    if (nestedTokens.accessToken || nestedTokens.message) {
      return nestedTokens;
    }
  }

  return primary;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasAccessToken()) {
      router.replace(nextPath);
    }
  }, [nextPath, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await apiFetch<LoginResponse>("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const { accessToken, refreshToken, message } = extractTokens(response);

      if (!accessToken) {
        throw new Error(message ?? "لم يتم استلام التوكن من السيرفر.");
      }
      setAccessToken(accessToken);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
      router.replace(nextPath);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "فشل تسجيل الدخول.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 text-right">
          <h1 className="text-2xl font-semibold text-slate-900">
            تسجيل الدخول
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ادخل بيانات الأدمن للوصول إلى لوحة التحكم.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1 text-right">
            <label className="text-sm font-semibold text-slate-700">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
              placeholder="admin@example.com"
              dir="ltr"
            />
          </div>

          <div className="space-y-1 text-right">
            <label className="text-sm font-semibold text-slate-700">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-right text-sm text-rose-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isSubmitting ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

