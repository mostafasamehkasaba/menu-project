"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";
import {
  createReservation,
  fetchReservations,
  fetchTables,
  type ApiReservation,
  type ApiTable,
} from "../../services/admin-api";

type ReservationStatus = ApiReservation["status"];

type StatusMeta = {
  label: string;
  className: string;
  icon: React.ReactNode;
};

const statusMap: Record<ReservationStatus, StatusMeta> = {
  CONFIRMED: {
    label: "مؤكد",
    className: "bg-emerald-50 text-emerald-600",
    icon: <FiCheckCircle />,
  },
  PENDING: {
    label: "قيد الانتظار",
    className: "bg-amber-50 text-amber-600",
    icon: <FiClock />,
  },
  CANCELLED: {
    label: "ملغي",
    className: "bg-rose-50 text-rose-600",
    icon: <FiClock />,
  },
  NO_SHOW: {
    label: "لم يحضر",
    className: "bg-slate-100 text-slate-500",
    icon: <FiClock />,
  },
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ar-EG");
};

const formatTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const buildMenuLink = (table?: number | null) => {
  if (!table) {
    return "/menu";
  }
  return `/menu?table=${table}`;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [tables, setTables] = useState<ApiTable[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    tableId: "",
    status: "CONFIRMED" as ReservationStatus,
  });

  useEffect(() => {
    const load = async () => {
      setLoadError(null);
      const [reservationsData, tablesData] = await Promise.all([
        fetchReservations(),
        fetchTables(),
      ]);
      if (!reservationsData) {
        setLoadError("تعذر تحميل الحجوزات من الباك. تأكد من الاتصال والتوكن.");
        setReservations([]);
      } else {
        setReservations(reservationsData);
      }
      if (!tablesData) {
        setLoadError((prev) =>
          prev
            ? prev
            : "تعذر تحميل الطاولات من الباك. تأكد من الاتصال والتوكن."
        );
        setTables([]);
      } else {
        setTables(tablesData);
      }
    };
    load();
  }, []);

  const availableTables = useMemo(() => {
    return tables.filter((table) => table.status === "AVAILABLE");
  }, [tables]);

  const reservedTables = useMemo(() => {
    return tables.filter((table) => table.status === "RESERVED");
  }, [tables]);

  const handleAddReservation = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      return;
    }

    const startAt = new Date(`${form.date}T${form.time}:00`);
    if (Number.isNaN(startAt.getTime())) {
      setActionError("تاريخ أو وقت غير صالح.");
      return;
    }

    setActionError(null);
    try {
      const reservation = await createReservation({
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        start_at: startAt.toISOString(),
        party_size: Number(form.guests),
        table: form.tableId ? Number(form.tableId) : null,
        status: form.status,
      });

      setReservations((prev) => [reservation, ...prev]);
      setForm({
        name: "",
        phone: "",
        date: "",
        time: "",
        guests: 2,
        tableId: "",
        status: "CONFIRMED",
      });
      setShowForm(false);
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر حفظ الحجز.";
      setActionError(message);
    }
  };

  const pendingCount = reservations.filter((r) => r.status === "PENDING").length;
  const confirmedCount = reservations.filter((r) => r.status === "CONFIRMED").length;
  const todayCount = reservations.filter((r) => {
    const date = new Date(r.start_at);
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">إدارة الحجوزات</h1>
          <p className="text-sm text-slate-500">
            {reservations.length} حجوزات - {todayCount} اليوم
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            + حجز جديد
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            كل الحالات
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            كل الأيام
          </button>
        </div>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {loadError}
        </div>
      ) : null}

      {showForm ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-right text-sm text-slate-600">
              الاسم
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              رقم الهاتف
              <input
                type="text"
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              عدد الأشخاص
              <input
                type="number"
                min={1}
                value={form.guests}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    guests: Number(event.target.value),
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              التاريخ
              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, date: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الوقت
              <input
                type="time"
                value={form.time}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, time: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الطاولة (المتاحة فقط)
              <select
                value={form.tableId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tableId: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="">اختر طاولة</option>
                {availableTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    طاولة {table.number} - {table.capacity} أشخاص
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-right text-sm text-slate-600">
              الحالة
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as ReservationStatus,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="CONFIRMED">مؤكد</option>
                <option value="PENDING">قيد الانتظار</option>
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
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleAddReservation}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              إضافة الحجز
            </button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">قيد الانتظار</p>
              <p className="text-2xl font-semibold text-slate-900">
                {pendingCount}
              </p>
              <p className="text-xs text-slate-400">تحتاج تأكيد</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-600">
              <FiClock />
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">مؤكدة</p>
              <p className="text-2xl font-semibold text-slate-900">
                {confirmedCount}
              </p>
              <p className="text-xs text-slate-400">{reservations.length} إجمالي</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
              <FiCheckCircle />
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">حجوزات اليوم</p>
              <p className="text-2xl font-semibold text-slate-900">{todayCount}</p>
              <p className="text-xs text-slate-400">متابعة يومية</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-600">
              <FiCalendar />
            </span>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">قائمة الحجوزات</h2>
        </div>
        <div className="grid grid-cols-[1fr_1.2fr_1fr_1fr_1fr_1fr_120px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
          <div className="text-right">رقم الحجز</div>
          <div className="text-right">الاسم</div>
          <div className="text-right">التاريخ والوقت</div>
          <div className="text-right">عدد الأشخاص</div>
          <div className="text-right">الطاولة</div>
          <div className="text-right">الحالة</div>
          <div className="text-center">الإجراءات</div>
        </div>

        {reservations.map((reservation) => {
          const status = statusMap[reservation.status];
          return (
            <div
              key={reservation.id}
              className="grid grid-cols-[1fr_1.2fr_1fr_1fr_1fr_1fr_120px] items-center border-b border-slate-100 px-5 py-3 text-sm text-slate-700 last:border-b-0"
            >
              <div className="text-right font-semibold">
                {reservation.code ?? `#${reservation.id}`}
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  {reservation.customer_name}
                </p>
                <p className="text-xs text-slate-400">{reservation.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  {formatDate(reservation.start_at)}
                </p>
                <p className="text-xs text-slate-400">
                  {formatTime(reservation.start_at)}
                </p>
              </div>
              <div className="text-right">{reservation.party_size}</div>
              <div className="text-right">
                {reservation.table ? `طاولة ${reservation.table}` : "غير محدد"}
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
                            <div className="flex justify-center">
                {reservation.table ? (
                  <Link
                    href={buildMenuLink(reservation.table)}
                    className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
                    target="_blank"
                    rel="noreferrer"
                  >
                    فتح المنيو
                  </Link>
                ) : (
                  <span className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-400">
                    بدون طاولة
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          الطاولات المحجوزة
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {reservedTables.length === 0 ? (
            <span className="text-sm text-slate-400">لا توجد طاولات محجوزة</span>
          ) : (
            reservedTables.map((table) => (
              <span
                key={table.id}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
              >
                طاولة {table.number}
              </span>
            ))
          )}
        </div>
      </section>
    </div>
  );
}




