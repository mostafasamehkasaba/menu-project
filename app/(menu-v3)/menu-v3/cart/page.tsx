"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Amiri, Cormorant_Garamond } from "next/font/google";
import { formatCurrency } from "../../../lib/i18n";
import { useLanguage } from "../../../components/language-provider";
import {
  getCartItems,
  removeCartItem,
  updateCartItem,
  type CartItem,
} from "../cart-store";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function MenuV3CartPage() {
  const { dir, lang, t } = useLanguage();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const className = "menu-v3-skin";
    document.body.classList.add(className);
    document.documentElement.classList.add(className);
    setItems(getCartItems());
    return () => {
      document.body.classList.remove(className);
      document.documentElement.classList.remove(className);
    };
  }, []);

  const totals = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    return { total, count };
  }, [items]);

  return (
    <div
      className={`${amiri.className} min-h-screen text-[16px] sm:text-[18px] text-[color:var(--v3-ink)]`}
      dir={dir}
      style={
        {
          "--v3-cream": "#f8f4ee",
          "--v3-ink": "#2a2f2c",
          "--v3-muted": "#7a6f65",
          "--v3-accent": "#b85d3d",
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_40%_at_15%_0%,#fff2e8_0%,rgba(255,242,232,0)_60%),radial-gradient(80%_45%_at_85%_0%,#e9f2ee_0%,rgba(233,242,238,0)_65%),linear-gradient(180deg,#f8f4ee_0%,#f3ede7_55%,#efe7df_100%)]" />

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/menu-v3"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
          >
            {lang === "ar" ? "العودة للمنيو" : "Back to Menu"}
          </Link>
        </header>

        <div className="mt-6 rounded-[32px] bg-white/85 px-5 py-7 shadow-[0_18px_32px_rgba(15,23,42,0.12)] sm:px-6 sm:py-8">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-semibold ${cormorant.className}`}>
              {lang === "ar" ? "سلة الطلب" : "Your Cart"}
            </h1>
            <span className="text-sm text-[color:var(--v3-muted)]">
              {lang === "ar" ? `عدد العناصر ${totals.count}` : `${totals.count} items`}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="mt-8 text-center text-sm text-[color:var(--v3-muted)]">
              {lang === "ar" ? "السلة فارغة حالياً." : "Your cart is empty."}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/70 bg-white px-4 py-3 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div>
                      <p className={`text-base font-semibold ${cormorant.className}`}>{item.name}</p>
                      <p className="text-xs text-[color:var(--v3-muted)]">
                        {formatCurrency(item.price, lang)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setItems(updateCartItem(item.id, Math.max(1, item.qty - 1)))
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--v3-cream)] text-lg text-[color:var(--v3-muted)]"
                    >
                      -
                    </button>
                    <span className="text-base font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setItems(updateCartItem(item.id, item.qty + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--v3-accent)] text-lg text-white"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setItems(removeCartItem(item.id))}
                      className="rounded-full border border-[color:var(--v3-accent)] px-3 py-1 text-xs font-semibold text-[color:var(--v3-accent)]"
                    >
                      {lang === "ar" ? "حذف" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <span className="text-base font-semibold text-[color:var(--v3-accent)]">
              {lang === "ar" ? "الإجمالي" : "Total"}: {formatCurrency(totals.total, lang)}
            </span>
            <button
              type="button"
              className="rounded-full bg-[color:var(--v3-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(184,93,61,0.3)]"
            >
              {lang === "ar" ? "تأكيد الطلب" : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .menu-v3-skin {
          background: #f8f4ee !important;
          color: #2a2f2c;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
