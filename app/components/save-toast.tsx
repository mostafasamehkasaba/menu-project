"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

type ToastTone = "success" | "danger" | "info";

const toneClasses: Record<ToastTone, string> = {
  success: "bg-emerald-600",
  danger: "bg-rose-600",
  info: "bg-slate-800",
};

export default function SaveToast() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("تم حفظ التغييرات بنجاح");
  const [tone, setTone] = useState<ToastTone>("success");
  const hideTimer = useRef<number | null>(null);
  const unmountTimer = useRef<number | null>(null);

  useEffect(() => {
    const showToast = (nextMessage: string, nextTone: ToastTone) => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
      }
      if (unmountTimer.current) {
        window.clearTimeout(unmountTimer.current);
      }

      setMessage(nextMessage);
      setTone(nextTone);
      setMounted(true);
      setVisible(true);

      hideTimer.current = window.setTimeout(() => setVisible(false), 2000);
      unmountTimer.current = window.setTimeout(() => setMounted(false), 2600);
    };

    const onSave = () =>
      showToast("تم حفظ التغييرات بنجاح", "success");
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{
        message?: string;
        tone?: ToastTone;
      }>).detail;
      showToast(detail?.message ?? "تم تحديث الحالة", detail?.tone ?? "info");
    };

    window.addEventListener("app:save", onSave);
    window.addEventListener("app:toast", onToast);
    return () => {
      window.removeEventListener("app:save", onSave);
      window.removeEventListener("app:toast", onToast);
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
      }
      if (unmountTimer.current) {
        window.clearTimeout(unmountTimer.current);
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed left-4 right-4 top-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 sm:left-auto sm:right-6 sm:top-6 ${toneClasses[tone]} ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <FiCheckCircle className="text-lg" />
      {message}
    </div>
  );
}
