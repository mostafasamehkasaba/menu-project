"use client";

import Link from "next/link";
import { Cairo } from "next/font/google";
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { useLanguage } from "./components/language-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const socials: { label: string; href: string; Icon: IconType }[] = [
  { label: "TikTok", href: "#", Icon: FaTiktok },
  { label: "WhatsApp", href: "#", Icon: FaWhatsapp },
  { label: "X", href: "#", Icon: FaXTwitter },
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "Facebook", href: "#", Icon: FaFacebookF },
];

export default function Home() {
  const { dir, t } = useLanguage();
  const router = useRouter();
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const availableTables = [1, 3, 5, 6, 8, 10, 11, 12];
  return (
    <div
      className={`${cairo.className} relative min-h-screen overflow-hidden bg-[radial-gradient(900px_circle_at_8%_-10%,#fff0e6,transparent_55%),radial-gradient(900px_circle_at_95%_25%,#ffe7d9,transparent_55%),linear-gradient(180deg,#fff7f0_0%,#fffaf6_45%,#ffffff_100%)] text-slate-900`}
      dir={dir}
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffd7c2,transparent_60%)] opacity-70" />
      <div className="pointer-events-none absolute -right-24 top-36 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffcaa9,transparent_60%)] opacity-60" />

      <main className="relative z-10 mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-6 text-center sm:px-10">
        <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_18px_40px_rgba(232,110,62,0.2)]">
          <div className="absolute inset-0 rounded-full border-[5px] border-orange-200" />
          <div className="absolute inset-2 rounded-full border-[4px] border-orange-400" />
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-orange-100 text-orange-600">
            <div className="grid h-8 w-8 grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-sm bg-orange-500"
                />
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {t("welcomeTitle")}
        </h1>
        <p className="mt-2 text-base text-slate-500 sm:text-lg">
          <span className="inline-flex items-center gap-2" dir="ltr">
            <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-orange-100 text-orange-600">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-6"
              >
                <path
                  d="M3 5h1v14H3V5zm3 0h2v14H6V5zm4 0h1v14h-1V5zm3 0h2v14h-2V5zm4 0h1v14h-1V5zm3 0h2v14h-2V5z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span dir={dir}>{t("restaurantName")}</span>
          </span>
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-4">
          <Link
            href="/menu"
            className="flex items-center justify-center gap-3 rounded-2xl border border-orange-300 bg-white px-6 py-4 text-base font-semibold text-orange-600 shadow-[0_10px_24px_rgba(234,130,70,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(234,130,70,0.18)]"
          >
            <span className="text-lg">🍴</span>
            {t("viewMenuOnly")}
          </Link>
          <button
            type="button"
            onClick={() => setShowTablePicker(true)}
            className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(234,106,54,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(234,106,54,0.4)]"
          >
            <span className="text-lg">🍽️</span>
            {t("orderFromTable")}
          </button>
        </div>
      </main>

      <section className="relative z-10 border-t border-orange-100 bg-white/70 px-6 py-10 backdrop-blur sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <p className="text-sm font-semibold text-slate-500">
            {t("followUs")}
          </p>
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="follow-icon flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_18px_rgba(148,163,184,0.2)] ring-1 ring-slate-100"
                aria-label={social.label}
              >
                <social.Icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            {t("allRightsReserved")}
          </p>
        </div>
      </section>

      <button className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,0,0,0.2)]">
        {t("talkWithUs")}
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
          💬
        </span>
      </button>

      {showTablePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[36px] bg-white px-6 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <h3 className="text-xl font-semibold text-slate-900">
              {t("selectTable")}
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {availableTables.map((table) => {
                const isSelected = selectedTable === table;
                return (
                  <label
                    key={table}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>
                      {t("table")} {table}
                    </span>
                    <input
                      type="radio"
                      name="table"
                      checked={isSelected}
                      onChange={() => setSelectedTable(table)}
                      className="h-4 w-4 accent-orange-500"
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!selectedTable}
                onClick={() => {
                  if (!selectedTable) {
                    return;
                  }
                  setShowTablePicker(false);
                  setSelectedTable(null);
                  router.push(`/menu?from=table&table=${selectedTable}`);
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(234,106,54,0.25)] ${
                  selectedTable
                    ? "bg-orange-500"
                    : "cursor-not-allowed bg-orange-200"
                }`}
              >
                {t("confirm")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTablePicker(false);
                  setSelectedTable(null);
                }}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
