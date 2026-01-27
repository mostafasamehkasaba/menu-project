"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cairo } from "next/font/google";
import { motion } from "framer-motion";
import type { LocalizedText, TranslationKey } from "../lib/i18n";
import { formatCurrency, getLocalizedText } from "../lib/i18n";
import { useLanguage } from "../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const transactions: {
  id: string;
  label: LocalizedText;
  date: string;
  amount: number;
  type: "in" | "out";
}[] = [
  {
    id: "t1",
    label: { ar: "طلب #12345", en: "Order #12345" },
    date: "2024-01-15",
    amount: 85.5,
    type: "out",
  },
  {
    id: "t2",
    label: { ar: "شحن المحفظة", en: "Wallet top-up" },
    date: "2024-01-14",
    amount: 200,
    type: "in",
  },
  {
    id: "t3",
    label: { ar: "طلب #12344", en: "Order #12344" },
    date: "2024-01-13",
    amount: 120,
    type: "out",
  },
  {
    id: "t4",
    label: { ar: "شحن المحفظة", en: "Wallet top-up" },
    date: "2024-01-10",
    amount: 300,
    type: "in",
  },
  {
    id: "t5",
    label: { ar: "طلب #12343", en: "Order #12343" },
    date: "2024-01-09",
    amount: 65.5,
    type: "out",
  },
];

const reservations = [
  {
    id: "RES001",
    status: "confirmed",
    guests: 4,
    time: "19:00",
    date: "2024-01-20",
  },
  {
    id: "RES002",
    status: "completed",
    guests: 2,
    time: "20:30",
    date: "2024-01-18",
  },
];

const settings: {
  label: TranslationKey;
  icon: string;
  chevron?: boolean;
  value?: boolean;
  danger?: boolean;
  href?: string;
}[] = [
  { label: "editProfile", icon: "👤", chevron: true, href: "/account/edit" },
  { label: "notifications", icon: "🔔", chevron: true, href: "/notifications" },
  { label: "language", icon: "A", value: true },
  { label: "logout", icon: "⎋", danger: true },
];

const socials = [
  { label: "TikTok", icon: "♪", href: "#" },
  { label: "WhatsApp", icon: "🟢", href: "#" },
  { label: "X", icon: "X", href: "#" },
  { label: "Instagram", icon: "◎", href: "#" },
  { label: "Facebook", icon: "f", href: "#" },
];

export default function AccountPage() {
  const { dir, lang, t, toggleLang } = useLanguage();
  const [highlightReservations, setHighlightReservations] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.location.hash === "#reservations") {
      const target = document.getElementById("reservations");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        const highlightTimer = window.setTimeout(
          () => setHighlightReservations(true),
          0
        );
        const timer = window.setTimeout(
          () => setHighlightReservations(false),
          1800,
        );
        return () => {
          window.clearTimeout(highlightTimer);
          window.clearTimeout(timer);
        };
      }
    }
  }, []);

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <section className="w-full bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-[0_18px_36px_rgba(234,106,54,0.28)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl">
            👤
          </div>
          <div className="text-end">
            <h1 className="text-xl font-semibold sm:text-2xl">
              {t("myAccount")}
            </h1>
            <p className="text-sm text-orange-100 sm:text-base">أحمد محمد</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-28 pt-6 sm:px-10">
        <section className="mx-auto max-w-3xl rounded-[28px] bg-orange-500/95 p-6 text-white shadow-[0_16px_32px_rgba(234,106,54,0.25)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-orange-600">
              + {t("topUp")}
            </button>
            <div className="text-end">
              <p className="text-xs text-orange-100">{t("currentBalance")}</p>
              <p className="mt-1 text-3xl font-semibold sm:text-4xl">
                {formatCurrency(450, lang, 2)}
              </p>
              <p className="mt-2 text-xs text-orange-100">
                {t("useBalanceForPayments")}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-3">
          {[
            { label: t("support"), icon: "🎧", href: "#" },
            { label: t("book"), icon: "📅", href: "/book" },
            { label: t("menu"), icon: "🍽️", href: "/menu" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white px-6 py-6 text-sm font-semibold text-slate-700 shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            >
              <span className="text-2xl text-orange-500">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-10 max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex items-center justify-end">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("recentTransactions")}
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {transactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
              >
                <div
                  className={`text-sm font-semibold ${
                    item.type === "in" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {formatCurrency(item.amount, lang, 2)}
                  {item.type === "in" ? "+" : "-"}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <p className="text-sm font-semibold text-slate-900">
                      {getLocalizedText(item.label, lang)}
                    </p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                      item.type === "in"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {item.type === "in" ? "↓" : "↑"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <motion.section
          id="reservations"
          className="mx-auto mt-10 max-w-3xl scroll-mt-24 rounded-[28px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-8"
          animate={
            highlightReservations
              ? {
                  boxShadow: "0 0 0 2px rgba(234, 106, 54, 0.35)",
                }
              : { boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)" }
          }
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-end">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("myReservations")}
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {reservations.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-end text-sm font-semibold text-slate-900">
                    {item.id}
                  </div>
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold ${
                      item.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.status === "confirmed"
                      ? t("statusConfirmed")
                      : t("statusCompleted")}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-end gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    {item.guests} {t("guests")} 👤
                  </span>
                  <span className="flex items-center gap-1">
                    {item.time} ⏰
                  </span>
                  <span className="flex items-center gap-1">
                    {item.date} 📅
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <section className="mx-auto mt-10 max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="w-full">
            <h2
              className={`w-full text-base font-semibold text-slate-900 sm:text-lg ${
                lang === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("settings")}
            </h2>
          </div>

          <div className="mt-4 space-y-1">
            {settings.map((item, index) => {
              const rowClasses = `flex items-center justify-between py-4 ${
                index === 0 ? "" : "border-t border-slate-100"
              }`;
              const content = (
                <>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    {lang === "ar" ? (
                      <>
                        <span
                          className={
                            item.danger ? "text-rose-600" : "text-orange-500"
                          }
                        >
                          {item.icon}
                        </span>
                        <span
                          className={
                            item.danger ? "text-rose-600" : "text-slate-700"
                          }
                        >
                          {t(item.label)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={
                            item.danger ? "text-rose-600" : "text-slate-700"
                          }
                        >
                          {t(item.label)}
                        </span>
                        <span
                          className={
                            item.danger ? "text-rose-600" : "text-orange-500"
                          }
                        >
                          {item.icon}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                    {item.value && (
                      <span className="text-sm font-semibold text-slate-500">
                        {lang === "ar"
                          ? t("languageArabic")
                          : t("languageEnglish")}
                      </span>
                    )}
                    {item.chevron && (
                      <span
                        className="text-xl font-semibold text-slate-400 sm:text-2xl"
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    )}
                  </div>
                </>
              );

              if (item.label === "language") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={toggleLang}
                    className={`${rowClasses} w-full ${
                      lang === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {content}
                  </button>
                );
              }

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={rowClasses}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div key={item.label} className={rowClasses}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex items-center justify-end">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("followUs")}
            </h2>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="follow-icon flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
                aria-label={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
