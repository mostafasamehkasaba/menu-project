"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import { addToCart } from "../../lib/cart";
import { menuItems } from "../../lib/menu-data";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const fallbackExtras = [
  { id: "extra-1", label: "دجاج مشوي", price: 30 },
  { id: "extra-2", label: "جمبري", price: 50 },
];

export default function MenuItemPage() {
  const params = useParams();
  const idValue = Array.isArray(params.id) ? params.id[0] : params.id;
  const itemId = Number(idValue);
  const item = menuItems.find((entry) => entry.id === itemId);

  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const extras = useMemo(() => item?.extras ?? fallbackExtras, [item]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!item) {
    return (
      <div
        className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      >
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold">المنتج غير موجود</h1>
          <Link
            href="/menu"
            className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white"
          >
            الرجوع للمنيو
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      quantity
    );
    setToast("تمت الإضافة للسلة");
  };

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir="rtl"
    >
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-500 shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
          >
            ←
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">{item.name}</h1>
        </header>

        <section className="mt-6 overflow-hidden rounded-[28px] bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
          <img
            src={item.image}
            alt={item.name}
            className="h-64 w-full object-cover"
            loading="lazy"
          />
          <div className="space-y-4 px-6 pb-6 pt-5 text-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <span className="text-base font-semibold text-orange-500">
                egp {item.price}
              </span>
            </div>
            <p className="text-slate-500">{item.desc}</p>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">extras</p>
              <div className="space-y-3">
                {extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                  >
                    <span className="text-slate-700">{extra.label}</span>
                    <span className="text-orange-500">egp {extra.price}+</span>
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-slate-300"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">notes</p>
              <textarea
                placeholder="addNotesHere"
                className="h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">quantity</p>
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
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="text-base font-semibold text-orange-500">
            egp {item.price}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(234,106,54,0.3)]"
          >
            addToCart
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed right-6 top-6 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_rgba(15,23,42,0.18)]">
          {toast}
        </div>
      )}
    </div>
  );
}
