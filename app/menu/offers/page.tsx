"use client";

import Image from "next/image";
import Link from "next/link";
import { Cairo } from "next/font/google";
import type { LocalizedText } from "../../lib/i18n";
import { addToCart } from "../../lib/cart";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const dealItems: {
  id: number;
  title: LocalizedText;
  desc: LocalizedText;
  badge: string;
  oldPrice: number;
  price: number;
  save: number;
  image: string;
  menuId: number;
}[] = [
  {
    id: 1,
    title: { ar: "وجبة عائلية", en: "Family meal" },
    desc: { ar: "2 برجر + بيتزا كبيرة + 4 مشروبات", en: "2 burgers + large pizza + 4 drinks" },
    badge: "20%-",
    oldPrice: 500,
    price: 399,
    save: 101,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1400&q=80",
    menuId: 10,
  },
  {
    id: 2,
    title: { ar: "برجر لحم فاخر", en: "Premium beef burger" },
    desc: { ar: "برجر لحم بقري مع جبن الشيدر والخس والطماطم", en: "Beef burger with cheddar, lettuce, and tomato" },
    badge: "15%-",
    oldPrice: 180,
    price: 153,
    save: 27,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80",
    menuId: 4,
  },
];

const comboDeals: {
  id: number;
  title: LocalizedText;
  oldPrice: number;
  price: number;
  image: string;
  menuId: number;
}[] = [
  {
    id: 1,
    title: { ar: "بيتزا مارغريتا", en: "Margherita pizza" },
    oldPrice: 150,
    price: 127,
    image:
      "/images/Margherita pizza.jpg",
    menuId: 3,
  },
  {
    id: 2,
    title: { ar: "برجر لحم فاخر", en: "Premium beef burger" },
    oldPrice: 120,
    price: 102,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    menuId: 4,
  },
  {
    id: 3,
    title: { ar: "عصير برتقال طازج", en: "Fresh orange juice" },
    oldPrice: 35,
    price: 29,
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=80",
    menuId: 7,
  },
  {
    id: 4,
    title: { ar: "سلطة سيزر", en: "Caesar salad" },
    oldPrice: 80,
    price: 68,
    image:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=1200&q=80",
    menuId: 2,
  },
];

export default function OffersPage() {
  const { dir, lang, t } = useLanguage();
  const handleAddToCart = (item: {
    menuId: number;
    title: LocalizedText;
    price: number;
    image: string;
  }) => {
    addToCart({
      id: item.menuId,
      name: getLocalizedText(item.title, lang),
      price: item.price,
      image: item.image,
    });
  };
  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <section className="w-full rounded-[28px] border border-orange-200 bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-[0_20px_40px_rgba(234,106,54,0.25)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-lg">
              ↺
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold sm:text-xl">
                {t("todaysOffers")}
              </h1>
              <p className="text-xs text-orange-100 sm:text-sm">
                {t("saveMoreWithSpecialOffers")}
              </p>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-lg">
              ←
            </button>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-6xl rounded-[28px] bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 p-6 text-white shadow-[0_18px_36px_rgba(234,106,54,0.28)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-orange-600">
              {t("hotDeal")}
              <span>🔥</span>
            </span>
            <div className="text-end">
              <h2 className="text-xl font-semibold sm:text-2xl">
                {t("limitedTimeOffer")}
              </h2>
              <p className="text-xs text-orange-100 sm:text-sm">
                {t("hurryUpBeforeItEnds")}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            {[
              { value: "30", label: t("seconds") },
              { value: "45", label: t("minutes") },
              { value: "02", label: t("hours") },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex min-w-[76px] flex-col items-center rounded-xl bg-white/20 px-4 py-3 text-center"
              >
                <span className="text-xl font-semibold">{unit.value}</span>
                <span className="text-xs text-orange-100">{unit.label}</span>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-orange-600 shadow-[0_12px_24px_rgba(15,23,42,0.2)]">
            {t("grabThisDeal")}
          </button>
        </section>

        <section className="mx-auto mt-10 max-w-6xl">
          <div className="flex items-center justify-end">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("allOffers")}
            </h3>
          </div>
          <div className="mt-6 grid gap-6">
            {dealItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
              >
                <Link
                  href={`/menu/${item.menuId}`}
                  className="relative block h-48 sm:h-56"
                >
                  <Image
                    src={item.image}
                    alt={getLocalizedText(item.title, lang)}
                    fill
                    sizes="(min-width: 1024px) 1100px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                  <div className="absolute bottom-4 right-4 text-end text-white">
                    <h4 className="text-lg font-semibold">
                      {getLocalizedText(item.title, lang)}
                    </h4>
                    <p className="text-xs text-white/85">
                      {getLocalizedText(item.desc, lang)}
                    </p>
                  </div>
                </Link>
                <div className="grid gap-4 p-5 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-orange-50 text-orange-500">
                      <span className="text-sm font-semibold">
                        {item.badge.replace("%-", "%")}
                      </span>
                      <span className="text-[10px] uppercase text-slate-400">
                        {t("off")}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-orange-500">
                          {formatCurrency(item.price, lang)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(item.oldPrice, lang)}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-600">
                        {t("youSave")} {formatCurrency(item.save, lang)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="h-11 w-full rounded-2xl bg-orange-500 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(234,106,54,0.3)] sm:w-44"
                  >
                    {t("addToCart")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-6xl">
          <div className="flex items-center justify-end">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("comboDeals")}
            </h3>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {comboDeals.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[26px] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
              >
                <Link
                  href={`/menu/${item.menuId}`}
                  className="relative block h-40 sm:h-44"
                >
                  <Image
                    src={item.image}
                    alt={getLocalizedText(item.title, lang)}
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    {t("combo")}
                  </span>
                </Link>
                <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                  <div className="text-end">
                    <h4 className="text-base font-semibold">
                      {getLocalizedText(item.title, lang)}
                    </h4>
                  </div>
                  <div className="text-start">
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(item.oldPrice, lang)}
                    </span>
                    <div className="text-base font-semibold text-orange-500">
                      {formatCurrency(item.price, lang)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-6xl rounded-[28px] bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 p-6 text-white shadow-[0_18px_36px_rgba(234,106,54,0.28)] sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
              ✉
            </div>
            <h3 className="text-lg font-semibold sm:text-xl">
              {t("stayUpdated")}
            </h3>
            <p className="text-xs text-orange-100 sm:text-sm">
              {t("getExclusiveOffers")}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-orange-600">
              {t("subscribe")}
            </button>
            <input
              type="email"
              placeholder={t("yourEmail")}
              className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/70 outline-none focus:border-white/60"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
