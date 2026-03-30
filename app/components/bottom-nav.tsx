"use client";

import Link from "next/link";
import { Cairo } from "next/font/google";
import { useLanguage } from "./language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function BottomNav() {
  const { lang, t, toggleLang } = useLanguage();
  const navItems = [
    { label: t("account"), icon: "👤", href: "/account" },
    { label: t("cart"), icon: "🛒", href: "/cart" },
    { label: t("book"), icon: "📅", href: "/book" },
    { label: t("offers"), icon: "％", href: "/menu/offers" },
    { label: t("menu"), icon: "📋", href: "/menu" },
  ];

  return (
    <nav
      className={`${cairo.className} fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-around py-3 text-sm font-semibold text-slate-700">
        {navItems.map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ) : (
            <button
              key={item.label}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          )
        )}
        <button
          type="button"
          onClick={toggleLang}
          className="flex flex-col items-center gap-1"
          aria-label={t("language")}
          title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
        >
          <span className="text-xl">🌐</span>
          {lang === "ar" ? "EN" : "AR"}
        </button>
      </div>
    </nav>
  );
}
