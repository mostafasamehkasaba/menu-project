"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "../../components/language-provider";

export const useEnsureArabic = () => {
  const { lang, setLang } = useLanguage();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) {
      return;
    }
    didInit.current = true;
    if (lang !== "ar") {
      setLang("ar");
    }
  }, [lang, setLang]);
};

