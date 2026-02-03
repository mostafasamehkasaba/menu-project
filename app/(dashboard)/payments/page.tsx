"use client";

import { FiCalendar, FiChevronDown, FiCreditCard, FiDollarSign, FiFilter, FiGlobe, FiPlus, FiSearch } from "react-icons/fi";

const summaryCards = [
  {
    title: "إجمالي المدفوعات",
    value: "660 ر.س",
    meta: "12%+",
    icon: <FiDollarSign />,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "مدفوعات ناجحة",
    value: "4",
    meta: "80% معدل النجاح",
    icon: <FiCreditCard />,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    title: "مدفوعات فاشلة",
    value: "1",
    meta: "يجب المراجعة",
    icon: <FiCreditCard />,
    tone: "bg-rose-50 text-rose-600",
  },
];

const payments = [
  {
    id: "PAY-1245#",
    order: "#1245",
    table: "طاولة 5",
    amount: "285 ر.س",
    method: "بطاقة",
    status: "نجح",
    time: "14:30",
    date: "2025-01-27",
  },
  {
    id: "PAY-1244#",
    order: "#1244",
    table: "طاولة 2",
    amount: "100 ر.س",
    method: "محفظة إلكترونية",
    status: "نجح",
    time: "14:20",
    date: "2025-01-27",
    note: "دفعة جزئية",
  },
  {
    id: "PAY-1243#",
    order: "#1243",
    table: "توصيل",
    amount: "95 ر.س",
    method: "رصيد التطبيق",
    status: "نجح",
    time: "14:05",
    date: "2025-01-27",
  },
  {
    id: "PAY-1242#",
    order: "#1242",
    table: "طاولة 8",
    amount: "420 ر.س",
    method: "بطاقة",
    status: "فشل",
    time: "13:50",
    date: "2025-01-27",
  },
  {
    id: "PAY-1241#",
    order: "#1241",
    table: "طاولة 1",
    amount: "180 ر.س",
    method: "بطاقة",
    status: "نجح",
    time: "13:30",
    date: "2025-01-27",
  },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">المدفوعات</h1>
          <p className="text-sm text-slate-500">الرئيسية / المدفوعات</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500">
            <FiPlus />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500">
            <FiGlobe />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-500">
            <FiCalendar />
          </button>
        </div>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            جميع الحالات
            <FiChevronDown className="text-slate-400" />
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            جميع الطرق
            <FiFilter className="text-slate-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
          <FiSearch />
          <input
            type="text"
            placeholder="بحث عن طلب، طاولة، مستخدم..."
            className="w-56 bg-transparent text-right outline-none"
          />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-right">
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="text-xs text-slate-400">{card.meta}</p>
            </div>
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${card.tone}`}>
              {card.icon}
            </span>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">سجل المدفوعات</h2>
        </div>
        <div className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
          <div className="text-right">رقم الدفع</div>
          <div className="text-right">الطلب</div>
          <div className="text-right">المبلغ</div>
          <div className="text-right">طريقة الدفع</div>
          <div className="text-right">الحالة</div>
          <div className="text-right">الوقت</div>
        </div>

        {payments.map((payment) => (
          <div
            key={payment.id}
            className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr] items-center border-b border-slate-100 px-5 py-3 text-sm text-slate-700 last:border-b-0"
          >
            <div className="text-right font-semibold">{payment.id}</div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{payment.order}</p>
              <p className="text-xs text-slate-400">{payment.table}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{payment.amount}</p>
              {payment.note ? (
                <p className="text-xs text-slate-400">{payment.note}</p>
              ) : null}
            </div>
            <div className="text-right">{payment.method}</div>
            <div className="text-right">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  payment.status === "نجح"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {payment.status}
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{payment.time}</p>
              <p className="text-xs text-slate-400">{payment.date}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
