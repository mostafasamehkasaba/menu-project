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
  const { dir, lang, t, toggleLang } = useLanguage();
  return (
    <div
      className={`${cairo.className} relative min-h-screen overflow-hidden bg-[radial-gradient(900px_circle_at_8%_-10%,#fff0e6,transparent_55%),radial-gradient(900px_circle_at_95%_25%,#ffe7d9,transparent_55%),linear-gradient(180deg,#fff7f0_0%,#fffaf6_45%,#ffffff_100%)] text-slate-900`}
      dir={dir}
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffd7c2,transparent_60%)] opacity-70" />
      <div className="pointer-events-none absolute -right-24 top-36 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffcaa9,transparent_60%)] opacity-60" />

      <header className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10">
        <button
          type="button"
          onClick={toggleLang}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-orange-600 shadow-[0_8px_24px_rgba(232,110,62,0.18)] ring-1 ring-orange-100"
          aria-label={t("language")}
          title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
        >
          {lang === "ar" ? "EN" : "AR"}
        </button>
        <div className="text-xs text-slate-400">
          {lang === "ar" ? "AR" : "EN"}
        </div>
      </header>

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
          {t("restaurantName")}
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-4">
          <Link
            href="/menu"
            className="flex items-center justify-center gap-3 rounded-2xl border border-orange-300 bg-white px-6 py-4 text-base font-semibold text-orange-600 shadow-[0_10px_24px_rgba(234,130,70,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(234,130,70,0.18)]"
          >
            <span className="text-lg">🍴</span>
            {t("viewMenuOnly")}
          </Link>
          <button className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(234,106,54,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(234,106,54,0.4)]">
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
    </div>
  );
}
