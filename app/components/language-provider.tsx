"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Language, TranslationKey } from "../lib/i18n";
import { translations } from "../lib/i18n";

type LanguageContextValue = {
  lang: Language;
  dir: "rtl" | "ltr";
  t: (key: TranslationKey) => string;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "menu-lang";
const DEFAULT_LANG: Language = "ar";

const isLanguage = (value: string | null): value is Language =>
  value === "ar" || value === "en";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LANG;
    }

    const pathname = window.location.pathname;
    if (pathname.startsWith("/menu")) {
      return "ar";
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isLanguage(saved) ? saved : DEFAULT_LANG;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: (key: TranslationKey) => translations[lang][key],
      setLang: setLangState,
      toggleLang: () => setLangState((prev) => (prev === "ar" ? "en" : "ar")),
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
