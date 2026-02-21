"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import {
  getCartItems,
  removeCartItem,
  saveCartItems,
  updateCartItem,
  type CartItem,
} from "../../lib/cart";
import { formatCurrency } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function CartPage() {
  const { dir, lang, t } = useLanguage();
  const [items, setItems] = useState<CartItem[]>(() => getCartItems());
  const [orderType, setOrderType] = useState<"takeaway" | "dineIn">("dineIn");

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const handleIncrease = (id: number) => {
    const nextItems = items.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    setItems(nextItems);
    saveCartItems(nextItems);
  };

  const handleDecrease = (id: number) => {
    const target = items.find((item) => item.id === id);
    if (!target) {
      return;
    }
    const nextQty = Math.max(1, target.qty - 1);
    const nextItems = updateCartItem(id, nextQty);
    setItems(nextItems);
  };

  const handleRemove = (id: number) => {
    const nextItems = removeCartItem(id);
    setItems(nextItems);
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
            â†گ
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">{t("myCart")}</h1>
        </header>

        <section className="mt-8 space-y-6">
          {items.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              {t("emptyCart")}
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:flex-nowrap"
              >
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500"
                >
                  ًں—‘ï¸ڈ
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleIncrease(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white"
                  >
                    +
                  </button>
                  <span className="text-sm font-semibold">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => handleDecrease(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                  >
                    -
                  </button>
                </div>
                <div className="flex-1 text-end">
                  <h2 className="text-sm font-semibold">
                    {item.name}
                  </h2>
                  <p className="text-xs text-orange-500">
                    {formatCurrency(item.price, lang)}
                  </p>
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              </article>
            ))
          )}
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-semibold text-slate-700">
            {t("generalNotes")}
          </h2>
          <textarea
            placeholder={t("addNotesHere")}
            className="mt-4 h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
          />
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-semibold text-slate-700">
            {t("orderType")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { id: "takeaway", label: t("takeaway") },
              { id: "dineIn", label: t("dineIn") },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() =>
                  setOrderType(type.id as "takeaway" | "dineIn")
                }
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  orderType === type.id
                    ? "border-orange-400 bg-orange-50 text-orange-600"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </section>

        <Link
          href={`/checkout?orderType=${orderType}`}
          className="mt-8 flex w-full items-center justify-center rounded-2xl bg-orange-500 py-4 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(234,106,54,0.35)]"
        >
          {t("proceedToCheckout")} â€¢ {formatCurrency(total, lang, 2)}
        </Link>
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

