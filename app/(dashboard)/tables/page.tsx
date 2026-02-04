"use client";

import { useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import {
  FiChevronDown,
  FiCoffee,
  FiEdit2,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";

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
  const [statusFilter, setStatusFilter] = useState<"all" | TableStatus>("all");
  const [rows, setRows] = useState<Table[]>(tables);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [form, setForm] = useState({
    seats: "4",
    status: "available",
  });

  const filteredTables = useMemo(() => {
    return rows.filter(
      (table) => statusFilter === "all" || table.status === statusFilter
    );
  }, [rows, statusFilter]);

  const handleSaveTable = () => {
    const seatsValue = Number(form.seats);
    if (!Number.isFinite(seatsValue) || seatsValue <= 0) {
      return;
    }
    if (editingId !== null) {
      setRows((prev) =>
        prev.map((table) =>
          table.id === editingId
            ? {
                ...table,
                seats: seatsValue,
                status: form.status as TableStatus,
              }
            : table
        )
      );
    } else {
      const nextId = rows.length
        ? Math.max(...rows.map((table) => table.id)) + 1
        : 1;
      const nextTable: Table = {
        id: nextId,
        seats: seatsValue,
        status: form.status as TableStatus,
        order: null,
      };
      setRows((prev) => [...prev, nextTable]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ seats: "4", status: "available" });
  };

  const handleEdit = (table: Table) => {
    setEditingId(table.id);
    setForm({
      seats: String(table.seats),
      status: table.status,
    });
    setShowForm(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === null) {
      return;
    }
    setRows((prev) => prev.filter((table) => table.id !== deleteTarget));
    setDeleteTarget(null);
  };

  return (
    <div className={`${cairo.className} min-h-screen bg-slate-50 text-slate-900`} dir="rtl">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-right">
            <h1 className="text-lg font-semibold text-slate-900">إدارة الطاولات</h1>
            <p className="text-sm text-slate-500">إجمالي الطاولات: {rows.length}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | TableStatus)
                }
                className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-600"
              >
                <option value="all">الكل</option>
                <option value="available">{statusStyles.available.label}</option>
                <option value="occupied">{statusStyles.occupied.label}</option>
                <option value="reserved">{statusStyles.reserved.label}</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
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
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ seats: "4", status: "available" });
                setShowForm((prev) => !prev);
              }}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              <FiPlus />
              إضافة طاولة
            </button>
          </div>
        </header>

        {showForm ? (
          <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block text-right text-sm text-slate-600">
                عدد المقاعد
                <input
                  type="number"
                  value={form.seats}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, seats: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-right text-sm text-slate-600">
                الحالة
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, status: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                >
                  <option value="available">{statusStyles.available.label}</option>
                  <option value="occupied">{statusStyles.occupied.label}</option>
                  <option value="reserved">{statusStyles.reserved.label}</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveTable}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              >
                {editingId !== null ? "حفظ التعديل" : "إضافة الطاولة"}
              </button>
            </div>
          </section>
        ) : null}

        {deleteTarget !== null ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
              <div className="text-right">
                <h3 className="text-lg font-semibold text-slate-900">
                  تأكيد الحذف
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  هل تريد حذف الطاولة رقم{" "}
                  <span className="font-semibold text-slate-700">
                    {deleteTarget}
                  </span>
                  ؟
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  حذف الطاولة
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTables.map((table) => {
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

                <div className="mt-auto grid gap-2">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(table)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      <FiEdit2 />
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(table.id)}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-rose-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`w-full rounded-xl px-3 py-2 text-sm font-semibold ${style.button}`}
                  >
                    تغيير الحالة
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
