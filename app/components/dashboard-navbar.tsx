"use client";

import { FiBell, FiGlobe, FiPlus, FiSearch } from "react-icons/fi";

export default function DashboardNavbar() {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-1 text-right lg:order-1">
          <p className="text-sm font-semibold text-slate-900">لوحة التحكم</p>
          <p className="text-xs text-slate-400">الرئيسية / لوحة التحكم</p>
        </div>

        <div className="order-2 flex-1 lg:order-2">
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
            <FiSearch />
            <input
              type="text"
              placeholder="ابحث عن طلب..."
              className="w-full bg-transparent text-right outline-none"
            />
          </label>
        </div>

        <div className="order-3 flex items-center gap-3 lg:order-3">
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
