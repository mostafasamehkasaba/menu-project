"use client";

import { useMemo, useState, useEffect } from "react";
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
import {
  changeTableStatus,
  createTable,
  deleteTable,
  fetchTables,
  updateTable,
  type ApiTable,
} from "../../services/admin-api";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

type TableStatus = ApiTable["status"];

type StatusStyle = {
  pill: string;
  button: string;
  label: string;
};

const statusStyles: Record<TableStatus, StatusStyle> = {
  AVAILABLE: {
    pill: "bg-emerald-50 text-emerald-600",
    button: "bg-emerald-600 text-white",
    label: "متاح",
  },
  OCCUPIED: {
    pill: "bg-rose-50 text-rose-600",
    button: "bg-white text-slate-700 border border-slate-200",
    label: "مشغول",
  },
  RESERVED: {
    pill: "bg-blue-50 text-blue-600",
    button: "bg-white text-slate-700 border border-slate-200",
    label: "محجوز",
  },
};

const nextStatusMap: Record<TableStatus, TableStatus> = {
  AVAILABLE: "OCCUPIED",
  OCCUPIED: "RESERVED",
  RESERVED: "AVAILABLE",
};

export default function TablesPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | TableStatus>("all");
  const [rows, setRows] = useState<ApiTable[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [form, setForm] = useState({
    number: "",
    capacity: "4",
    status: "AVAILABLE" as TableStatus,
  });

  useEffect(() => {
    const load = async () => {
      setLoadError(null);
      const data = await fetchTables();
      if (!data) {
        setLoadError("تعذر تحميل الطاولات من الباك. تأكد من الاتصال والتوكن.");
        setRows([]);
        return;
      }
      setRows(data);
    };
    load();
  }, []);

  const filteredTables = useMemo(() => {
    return rows.filter(
      (table) => statusFilter === "all" || table.status === statusFilter
    );
  }, [rows, statusFilter]);

  const handleSaveTable = async () => {
    const numberValue = Number(form.number);
    const capacityValue = Number(form.capacity);
    if (!Number.isFinite(numberValue) || numberValue <= 0) {
      setActionError("رقم الطاولة غير صالح.");
      return;
    }
    if (!Number.isFinite(capacityValue) || capacityValue <= 0) {
      setActionError("سعة الطاولة غير صالحة.");
      return;
    }

    setActionError(null);
    try {
      if (editingId !== null) {
        const updated = await updateTable(editingId, {
          number: numberValue,
          capacity: capacityValue,
          status: form.status,
        });
        setRows((prev) =>
          prev.map((table) => (table.id === updated.id ? updated : table))
        );
      } else {
        const created = await createTable({
          number: numberValue,
          capacity: capacityValue,
          status: form.status,
        });
        setRows((prev) => [...prev, created]);
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ number: "", capacity: "4", status: "AVAILABLE" });
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر حفظ الطاولة.";
      setActionError(message);
    }
  };

  const handleEdit = (table: ApiTable) => {
    setEditingId(table.id);
    setForm({
      number: String(table.number),
      capacity: String(table.capacity),
      status: table.status,
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget === null) {
      return;
    }
    setActionError(null);
    try {
      await deleteTable(deleteTarget);
      setRows((prev) => prev.filter((table) => table.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر حذف الطاولة.";
      setActionError(message);
    }
  };

  const handleToggleStatus = async (table: ApiTable) => {
    const nextStatus = nextStatusMap[table.status];
    setActionError(null);
    try {
      const updated = await changeTableStatus(table.id, nextStatus);
      setRows((prev) =>
        prev.map((row) => (row.id === updated.id ? updated : row))
      );
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر تحديث حالة الطاولة.";
      setActionError(message);
    }
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
                <option value="AVAILABLE">{statusStyles.AVAILABLE.label}</option>
                <option value="OCCUPIED">{statusStyles.OCCUPIED.label}</option>
                <option value="RESERVED">{statusStyles.RESERVED.label}</option>
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
                setForm({ number: "", capacity: "4", status: "AVAILABLE" });
                setShowForm((prev) => !prev);
              }}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              <FiPlus />
              إضافة طاولة
            </button>
          </div>
        </header>

        {loadError ? (
          <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {loadError}
          </div>
        ) : null}

        {showForm ? (
          <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block text-right text-sm text-slate-600">
                رقم الطاولة
                <input
                  type="number"
                  value={form.number}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, number: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-right text-sm text-slate-600">
                عدد المقاعد
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, capacity: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-right text-sm text-slate-600">
                الحالة
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      status: event.target.value as TableStatus,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                >
                  <option value="AVAILABLE">{statusStyles.AVAILABLE.label}</option>
                  <option value="OCCUPIED">{statusStyles.OCCUPIED.label}</option>
                  <option value="RESERVED">{statusStyles.RESERVED.label}</option>
                </select>
              </label>
            </div>

            {actionError ? (
              <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-right text-sm text-rose-600">
                {actionError}
              </div>
            ) : null}

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
                    <p className="text-sm font-semibold text-slate-900">
                      طاولة {table.number}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <FiUsers />
                      {table.capacity} أشخاص
                    </p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FiCoffee />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {table.current_order ? (
                    <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                      طلب #{table.current_order}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">‏</span>
                  )}
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style.pill}`}>
                    {style.label}
                  </span>
                </div>

                {table.current_order ? (
                  <p className="mt-2 text-xs text-slate-500">الطلب: {table.current_order}#</p>
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
                    onClick={() => handleToggleStatus(table)}
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

