"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import { categories, menuItems, todayOffers } from "../lib/menu-data";
import { formatCurrency, getLocalizedText } from "../lib/i18n";
import { useLanguage } from "../components/language-provider";
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function MenuPage() {
  const [activeId, setActiveId] = useState("all");
  const { dir, lang, t, toggleLang } = useLanguage();

  const filteredItems = useMemo(() => {
    if (activeId === "all") {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === activeId);
  }, [activeId]);

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="grid grid-cols-3 items-center gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="h-11 w-11 rounded-full bg-white text-sm font-semibold text-orange-600 shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
            aria-label={t("language")}
            title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>
          <div className="text-center">
            <h1 className="text-xl font-semibold sm:text-2xl">
              {t("restaurantName")}
            </h1>
          </div>
          <div className="flex justify-start">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-orange-500 shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
              <span className="text-xl">âŒپ</span>
            </div>
          </div>
        </header>

        <div className="mt-5">
          <label className="relative block">
            <span className="sr-only">{t("search")}</span>
            <input
              type="text"
              placeholder={t("search")}
              className="w-full rounded-2xl border border-transparent bg-white px-5 py-4 text-sm text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)] outline-none transition focus:border-orange-200"
            />
          </label>
        </div>

        <section className="mt-8 rounded-3xl bg-white px-5 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)] sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
              %
            </div>
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("todaysOffers")}
            </h2>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {todayOffers.map((offer) => (
              <article
                key={offer.id}
                className="relative overflow-hidden rounded-3xl bg-[#f8fafc] shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
              >
                <span className="absolute right-4 top-4 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white">
                  {offer.badge}
                </span>
                <img
                  src={offer.image}
                  alt={getLocalizedText(offer.title, lang)}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-2 px-5 pb-5 pt-4 text-sm">
                  <h3 className="text-base font-semibold">
                    {getLocalizedText(offer.title, lang)}
                  </h3>
                  <p className="text-slate-500">
                    {getLocalizedText(offer.desc, lang)}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-orange-500">
                      {formatCurrency(offer.price, lang)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(offer.oldPrice, lang)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveId(category.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_18px_rgba(15,23,42,0.08)] transition ${
                  activeId === category.id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-slate-700 hover:text-orange-500"
                }`}
              >
                <span>{category.icon}</span>
                {getLocalizedText(category.label, lang)}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
            >
              <Link href={`/menu/${item.id}`} className="block">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={getLocalizedText(item.name, lang)}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                  {item.tag && (
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                        item.tag === "new" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    >
                      {item.tag === "new" ? t("tagNew") : t("tagHot")}
                    </span>
                  )}
                </div>
              </Link>
              <div className="relative space-y-2 px-5 pb-10 pt-4 text-sm">
                <Link href={`/menu/${item.id}`}>
                  <h3 className="text-base font-semibold">
                    {getLocalizedText(item.name, lang)}
                  </h3>
                </Link>
                <p className="text-slate-500">
                  {getLocalizedText(item.desc, lang)}
                </p>
                <p className="text-orange-500">
                  {formatCurrency(item.price, lang)}
                </p>
                <Link
                  href={`/menu/${item.id}`}
                  className={`absolute bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-xl text-white shadow-[0_10px_18px_rgba(234,106,54,0.35)] ${
                    dir === "rtl" ? "left-4" : "right-4"
                  }`}
                  aria-label={t("addToCart")}
                >
                  +
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>

      <button className="fixed bottom-20 right-6 flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,0,0,0.2)]">
        {t("talkWithUs")}
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
          ًں’¬
        </span>
      </button>

    </div>
  );
}

