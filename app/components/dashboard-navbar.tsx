"use client";

import { useEffect, useState } from "react";
import { FiBell, FiGlobe, FiPlus, FiSearch } from "react-icons/fi";

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("restaurant_open");
    if (stored === "false") {
      setIsOpen(false);
    }
  }, []);

  const toggleStatus = () => {
    setIsOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem("restaurant_open", next ? "true" : "false");
      window.dispatchEvent(
        new CustomEvent("app:restaurant-status", { detail: { open: next } })
      );
      if (!next) {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { message: "المطعم مغلق الآن", tone: "danger" },
          })
        );
      }
      return next;
    });
  };

  return (
    <header className="rounded-3xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-1 text-right lg:order-1">
          <p className="text-sm font-semibold text-slate-900">لوحة التحكم</p>
          <p className="text-xs text-slate-400">الرئيسية / لوحة التحكم</p>
        </div>

        <div className="order-2 w-full flex-1 lg:order-2">
          <label className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
            <FiSearch />
            <input
              type="text"
              placeholder="ابحث عن طلب..."
              className="w-full bg-transparent text-right outline-none"
            />
          </label>
        </div>

        <div className="order-3 flex flex-wrap items-center justify-end gap-3 lg:order-3">
          <button
            type="button"
            onClick={toggleStatus}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white transition ${
              isOpen
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-rose-600 hover:bg-rose-500"
            }`}
            aria-pressed={!isOpen}
          >
            <span className="h-2 w-2 rounded-full bg-white/80" />
            {isOpen ? "مفتوح" : "مغلق"}
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600">
            <FiPlus />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600">
            <FiGlobe />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600">
            <FiBell />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
              أ
            </span>
            أحمد محمد
          </div>
        </div>
      </div>
    </header>
  );
}
