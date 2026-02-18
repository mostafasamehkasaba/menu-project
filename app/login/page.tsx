"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
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

function LoginPageContent() {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        throw new Error(
          message ??
            "\u0644\u0645 \u064a\u062a\u0645 \u0627\u0633\u062a\u0644\u0627\u0645 \u0627\u0644\u062a\u0648\u0643\u0646 \u0645\u0646 \u0627\u0644\u0633\u064a\u0631\u0641\u0631."
        );
      }
      setAccessToken(accessToken);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
      router.replace(nextPath);
    } catch (err) {
      const message =
        (err as { message?: string })?.message ??
        "\u0641\u0634\u0644 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.9)_0%,_rgba(2,6,23,0.98)_60%)]" />
      <div className="pointer-events-none absolute -top-40 right-10 h-80 w-80 rounded-full bg-emerald-400/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-96 w-96 rounded-full bg-cyan-400/20 blur-[130px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {"\u0644\u0648\u062d\u0629 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0637\u0639\u0645"}
            </div>

            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              {
                "\u0645\u0646\u0635\u0629 \u062a\u062d\u0643\u0645 \u0630\u0643\u064a\u0629 \u0644\u0644\u0645\u0628\u064a\u0639\u0627\u062a \u0648\u0627\u0644\u0637\u0644\u0628\u0627\u062a"
              }
            </h1>

            <p className="max-w-xl text-base text-white/70">
              {
                "\u0631\u0627\u062c\u0639 \u0627\u0644\u0623\u062f\u0627\u0621 \u0644\u062d\u0638\u0629 \u0628\u0644\u062d\u0638\u0629\u060c \u0648\u0627\u062f\u0650\u0631 \u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0628\u0648\u0627\u062c\u0647\u0629 \u0627\u062d\u062a\u0631\u0627\u0641\u064a\u0629 \u0648\u0627\u0636\u062d\u0629."
              }
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "\u062a\u062d\u062f\u064a\u062b\u0627\u062a \u0641\u0648\u0631\u064a\u0629 \u0644\u0644\u062d\u0627\u0644\u0629",
                "\u0645\u0644\u062e\u0635\u0627\u062a \u064a\u0648\u0645\u064a\u0629 \u0644\u0644\u0645\u0628\u064a\u0639\u0627\u062a",
                "\u0625\u0634\u0639\u0627\u0631\u0627\u062a \u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u062c\u062f\u064a\u062f\u0629",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl backdrop-blur md:p-8">
            <div className="mb-6 text-right">
              <p className="text-xs font-semibold text-emerald-600">
                {
                  "\u0648\u0627\u062c\u0647\u0629 \u0633\u0631\u064a\u0639\u0629 \u0648\u0622\u0645\u0646\u0629 \u0644\u0625\u062f\u0627\u0631\u0629 \u0643\u0644 \u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0645\u0637\u0639\u0645."
                }
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {"\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {
                  "\u0627\u062f\u062e\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0623\u062f\u0645\u0646 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645."
                }
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1 text-right">
                <label className="text-sm font-semibold text-slate-700">
                  {"\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100/60 px-4 py-2 text-right text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
                  placeholder="admin@example.com"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-sm font-semibold text-slate-700">
                  {"\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631"}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100/60 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white"
                  placeholder="********"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
                  />
                  <span>{"\u062a\u0630\u0643\u0631\u0646\u064a"}</span>
                </label>
                <button
                  type="button"
                  className="font-semibold text-emerald-600 transition hover:text-emerald-500"
                >
                  {"\u0646\u0633\u064a\u062a \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061f"}
                </button>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-right text-sm text-rose-600">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {isSubmitting
                  ? "\u062c\u0627\u0631\u064a \u0627\u0644\u062f\u062e\u0648\u0644..."
                  : "\u0627\u0644\u062f\u062e\u0648\u0644 \u0625\u0644\u0649 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-right text-sm text-white/70">
            {"\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644..."}
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
