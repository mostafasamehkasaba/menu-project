"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import { addToCart } from "../../lib/cart";
import { menuItems } from "../../lib/menu-data";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const fallbackExtras = [
  { id: "extra-1", label: { ar: "دجاج مشوي", en: "Grilled chicken" }, price: 30 },
  { id: "extra-2", label: { ar: "جمبري", en: "Shrimp" }, price: 50 },
];

export default function MenuItemPage() {
  const params = useParams();
  const { dir, lang, t } = useLanguage();
  const idValue = Array.isArray(params.id) ? params.id[0] : params.id;
  const itemId = Number(idValue);
  const item = menuItems.find((entry) => entry.id === itemId);

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>(
    {}
  );
  const [cartToast, setCartToast] = useState<{
    total: number;
    count: number;
  } | null>(null);

  const extras = useMemo(() => item?.extras ?? fallbackExtras, [item]);
  const extrasTotal = useMemo(
    () =>
      extras.reduce(
        (sum, extra) => sum + (selectedExtras[extra.id] ? extra.price : 0),
        0
      ),
    [extras, selectedExtras]
  );
  const unitPrice = item ? item.price + extrasTotal : 0;
  const totalPrice = unitPrice * quantity;

  useEffect(() => {
    if (!cartToast) {
      return;
    }

    const timer = window.setTimeout(() => setCartToast(null), 2000);
    return () => window.clearTimeout(timer);
  }, [cartToast]);

  if (!item) {
    return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">{t("productNotFound")}</h1>
        <Link
          href="/menu"
          className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white"
        >
          {t("backToMenu")}
        </Link>
      </div>
    </div>
  );
  }

  const handleAddToCart = () => {
    const items = addToCart(
      {
        id: item.id,
        name: getLocalizedText(item.name, lang),
        price: unitPrice,
        image: item.image,
      },
      quantity
    );
    const total = items.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
    const count = items.reduce((sum, entry) => sum + entry.qty, 0);
    setCartToast({ total, count });
  };

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-500 shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
          >
            ←
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">
            {getLocalizedText(item.name, lang)}
          </h1>
        </header>

        <section className="mt-6 overflow-hidden rounded-[28px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
          <img
            src={item.image}
            alt={getLocalizedText(item.name, lang)}
            className="h-64 w-full object-cover"
            loading="lazy"
          />
          <div className="space-y-4 px-6 pb-6 pt-5 text-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {getLocalizedText(item.name, lang)}
              </h2>
              <span className="text-base font-semibold text-orange-500">
                {formatCurrency(totalPrice, lang)}
              </span>
            </div>
            <p className="text-slate-500">
              {getLocalizedText(item.desc, lang)}
            </p>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                {t("extras")}
              </p>
              <div className="space-y-3">
                {extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  >
                    <span className="text-slate-700">
                      {getLocalizedText(extra.label, lang)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-500">
                        {formatCurrency(extra.price, lang)}+
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(selectedExtras[extra.id])}
                        onChange={() =>
                          setSelectedExtras((prev) => ({
                            ...prev,
                            [extra.id]: !prev[extra.id],
                          }))
                        }
                        className="h-5 w-5 rounded border-slate-300"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                {t("notes")}
              </p>
              <textarea
                placeholder={t("addNotesHere")}
                className="h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                {t("quantity")}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500"
                >
                  -
                </button>
                <span className="text-base font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-lg text-white"
                >
                  +
                </button>
              </div>
            </div>

            <div
              className={`mt-6 flex flex-wrap items-center justify-between gap-3 ${
                dir === "rtl" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <span className="text-base font-semibold text-orange-500">
                {formatCurrency(totalPrice, lang)}
              </span>
              <button
                type="button"
                onClick={handleAddToCart}
                className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(234,106,54,0.3)]"
              >
                {t("addToCart")}
              </button>
            </div>
          </div>
        </section>
      </div>

      {cartToast && (
        <div className="fixed bottom-24 left-6">
          <div
            className={`flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(234,106,54,0.35)] ${
              dir === "rtl" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span>{formatCurrency(cartToast.total, lang, 0)}</span>
            <span className="opacity-90">{t("cart")}</span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs">
              {cartToast.count}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
