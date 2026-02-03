"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";
import { tableFloors, type TableFloor } from "../../lib/table-floors";

type ReservationStatus = "confirmed" | "pending";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  table: number | null;
  status: ReservationStatus;
};

const initialReservations: Reservation[] = [
  {
    id: "RES-001#",
    name: "محمد أحمد",
    phone: "966+ 123 50 9566",
    date: "2025-01-28",
    time: "19:00",
    guests: 4,
    table: 5,
    status: "confirmed",
  },
  {
    id: "RES-002#",
    name: "سارة علي",
    phone: "966+ 987 55 9664",
    date: "2025-01-28",
    time: "20:00",
    guests: 2,
    table: 2,
    status: "pending",
  },
  {
    id: "RES-003#",
    name: "خالد محمود",
    phone: "966+ 555 50 966",
    date: "2025-01-28",
    time: "21:00",
    guests: 6,
    table: 8,
    status: "confirmed",
  },
  {
    id: "RES-004#",
    name: "فاطمة سعيد",
    phone: "966+ 222 54 966",
    date: "2025-01-29",
    time: "18:30",
    guests: 8,
    table: 11,
    status: "confirmed",
  },
  {
    id: "RES-005#",
    name: "عبدالله سعيد",
    phone: "966+ 777 56 966",
    date: "2025-01-29",
    time: "19:30",
    guests: 3,
    table: null,
    status: "pending",
  },
];

const statusMap: Record<
  ReservationStatus,
  { label: string; className: string; icon: ReactNode }
> = {
  confirmed: {
    label: "مؤكد",
    className: "bg-emerald-50 text-emerald-600",
    icon: <FiCheckCircle />,
  },
  pending: {
    label: "قيد الانتظار",
    className: "bg-amber-50 text-amber-600",
    icon: <FiClock />,
  },
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(
    initialReservations
  );
  const [floors, setFloors] = useState<TableFloor[]>(tableFloors);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    tableId: "",
    status: "confirmed" as ReservationStatus,
  });

  const availableTables = useMemo(() => {
    return floors
      .flatMap((floor) => floor.tables)
      .filter((table) => table.status === "available");
  }, [floors]);

  const reservedTables = useMemo(() => {
    return floors
      .flatMap((floor) => floor.tables)
      .filter((table) => table.status === "reserved");
  }, [floors]);

  const handleAddReservation = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      return;
    }

    const nextId = `RES-${String(reservations.length + 1).padStart(3, "0")}#`;
    const tableNumber = form.tableId ? Number(form.tableId) : null;

    setReservations((prev) => [
      {
        id: nextId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        table: tableNumber,
        status: form.status,
      },
      ...prev,
    ]);

    if (tableNumber) {
      setFloors((prev) =>
        prev.map((floor) => ({
          ...floor,
          tables: floor.tables.map((table) =>
            table.id === tableNumber
              ? { ...table, status: "reserved" }
              : table
          ),
        }))
      );
    }

    setForm({
      name: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
      tableId: "",
      status: "confirmed",
    });
    setShowForm(false);
  };

  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">إدارة الحجوزات</h1>
          <p className="text-sm text-slate-500">
            {reservations.length} حجوزات - 0 اليوم
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
                    طاولة {table.id} - {table.seats} أشخاص
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
                <option value="confirmed">مؤكد</option>
                <option value="pending">قيد الانتظار</option>
              </select>
            </label>
          </div>

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
              <p className="text-xs text-slate-400">60% من الإجمالي</p>
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
              <p className="text-2xl font-semibold text-slate-900">0</p>
              <p className="text-xs text-slate-400">0 محصلة تقريبًا</p>
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
              <div className="text-right font-semibold">{reservation.id}</div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{reservation.name}</p>
                <p className="text-xs text-slate-400">{reservation.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{reservation.date}</p>
                <p className="text-xs text-slate-400">{reservation.time}</p>
              </div>
              <div className="text-right">{reservation.guests}</div>
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
                <button className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  تفاصيل
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          الطاولات المحجوزة (مرتبطة بصفحة الحجز)
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
                طاولة {table.id}
              </span>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
