"use client";

import { Cairo } from "next/font/google";
import { FiChevronDown, FiCoffee, FiFilter, FiPlus, FiSearch, FiUsers } from "react-icons/fi";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

type TableStatus = "available" | "occupied" | "reserved";

type Table = {
  id: number;
  seats: number;
  status: TableStatus;
  order: number | null;
  badge?: string;
};

const statusStyles: Record<
  TableStatus,
  { pill: string; button: string; label: string }
> = {
  available: {
    pill: "bg-emerald-50 text-emerald-600",
    button: "bg-emerald-600 text-white",
    label: "متاح",
  },
  occupied: {
    pill: "bg-rose-50 text-rose-600",
    button: "bg-white text-slate-700 border border-slate-200",
    label: "مشغول",
  },
  reserved: {
    pill: "bg-blue-50 text-blue-600",
    button: "bg-white text-slate-700 border border-slate-200",
    label: "محجوز",
  },
};

const tables: Table[] = [
  { id: 1, seats: 4, status: "available", order: null },
  { id: 2, seats: 2, status: "occupied", order: 1234 },
  { id: 3, seats: 6, status: "occupied", order: 1235, badge: "1 طلب" },
  { id: 4, seats: 4, status: "reserved", order: null },
  { id: 5, seats: 8, status: "occupied", order: 1236 },
  { id: 6, seats: 2, status: "available", order: null },
  { id: 7, seats: 4, status: "occupied", order: 1237, badge: "2 طلب" },
  { id: 8, seats: 6, status: "available", order: null },
  { id: 9, seats: 4, status: "reserved", order: null },
  { id: 10, seats: 2, status: "available", order: null },
  { id: 11, seats: 8, status: "occupied", order: 1238 },
  { id: 12, seats: 4, status: "available", order: null },
];

export default function TablesPage() {
  return (
    <div className={`${cairo.className} min-h-screen bg-slate-50 text-slate-900`} dir="rtl">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-right">
            <h1 className="text-lg font-semibold text-slate-900">إدارة الطاولات</h1>
            <p className="text-sm text-slate-500">إجمالي الطاولات: 12</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
              الكل
              <FiChevronDown />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500">
              <FiFilter />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
              <FiSearch />
              <input
                type="text"
                placeholder="بحث عن طاولة..."
                className="w-44 bg-transparent text-right outline-none sm:w-56"
              />
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              <FiPlus />
              إضافة طاولة
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => {
            const style = statusStyles[table.status];
            return (
              <article
                key={table.id}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">طاولة {table.id}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <FiUsers />
                      {table.seats} أشخاص
                    </p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FiCoffee />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {table.badge ? (
                    <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                      {table.badge}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">‏</span>
                  )}
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style.pill}`}>
                    {style.label}
                  </span>
                </div>

                {table.order ? (
                  <p className="mt-2 text-xs text-slate-500">الطلب: {table.order}#</p>
                ) : null}

                <button
                  className={`mt-auto w-full rounded-xl px-3 py-2 text-sm font-semibold ${style.button}`}
                >
                  تغيير الحالة
                </button>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
