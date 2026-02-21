"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cairo } from "next/font/google";
import { useLanguage } from "../../../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function EditProfilePage() {
  const { dir, lang, t } = useLanguage();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastOpen) {
      return;
    }

    let closeTimer: number | undefined;
    const raf = window.requestAnimationFrame(() => setToastVisible(true));
    const hideTimer = window.setTimeout(() => {
      setToastVisible(false);
      closeTimer = window.setTimeout(() => setToastOpen(false), 250);
    }, 2000);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(hideTimer);
      if (closeTimer) {
        window.clearTimeout(closeTimer);
      }
    };
  }, [toastOpen]);

  const handleSave = () => {
    setToastOpen(true);
    setToastVisible(false);
  };

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      {toastOpen && (
        <div
          className={`fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.35)] transition-all duration-300 ${
            toastVisible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
          role="status"
          aria-live="polite"
        >
          <span className="text-lg" aria-hidden="true">
            âœ“
          </span>
          <span>{t("profileUpdatedSuccess")}</span>
        </div>
      )}
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="flex items-center gap-2 text-sm font-semibold text-orange-600"
          >
            <span aria-hidden="true">{lang === "ar" ? "â†’" : "â†گ"}</span>
            {t("backToAccount")}
          </Link>
          <h1
            className={`text-lg font-semibold text-slate-900 sm:text-xl ${
              lang === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t("editProfile")}
          </h1>
        </div>

        <section className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="space-y-5">
            <div>
              <label
                className={`mb-2 block text-sm font-semibold text-slate-600 ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("yourName")}
              </label>
              <input
                type="text"
                placeholder={t("enterYourName")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div>
              <label
                className={`mb-2 block text-sm font-semibold text-slate-600 ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("yourEmail")}
              </label>
              <input
                type="email"
                placeholder={t("enterYourEmail")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div>
              <label
                className={`mb-2 block text-sm font-semibold text-slate-600 ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("phoneNumber")}
              </label>
              <input
                type="tel"
                placeholder={t("enterYourPhone")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div>
              <label
                className={`mb-2 block text-sm font-semibold text-slate-600 ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("address")}
              </label>
              <input
                type="text"
                placeholder={t("enterAddress")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div>
              <label
                className={`mb-2 block text-sm font-semibold text-slate-600 ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                {t("dateOfBirth")}
              </label>
              <input
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="mt-2 w-full rounded-2xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(234,106,54,0.32)] transition hover:bg-orange-600"
            >
              {t("saveChanges")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

