"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function SaveToast() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handler = () => {
      setMounted(true);
      setVisible(true);
      const hideTimer = window.setTimeout(() => setVisible(false), 2000);
      const unmountTimer = window.setTimeout(() => setMounted(false), 2600);
      return () => {
        window.clearTimeout(hideTimer);
        window.clearTimeout(unmountTimer);
      };
    };

    const onSave = () => handler();
    window.addEventListener("app:save", onSave);
    return () => window.removeEventListener("app:save", onSave);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed right-6 top-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <FiCheckCircle className="text-lg" />
      تم حفظ التغيرات بنجاح
    </div>
  );
}
