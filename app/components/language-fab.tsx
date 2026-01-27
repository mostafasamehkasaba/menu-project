"use client";

import { useLanguage } from "./language-provider";

export default function LanguageFab() {
  const { lang, t, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`fixed top-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-orange-600 shadow-[0_8px_24px_rgba(232,110,62,0.18)] ring-1 ring-orange-100 ${
        lang === "ar" ? "left-6" : "right-6"
      }`}
      aria-label={t("language")}
      title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
    >
      {lang === "ar" ? "EN" : "AR"}
    </button>
  );
}
