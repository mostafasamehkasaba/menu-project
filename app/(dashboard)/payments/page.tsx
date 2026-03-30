"use client";

import { useMemo, useState, useEffect } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiCreditCard,
  FiDollarSign,
  FiGlobe,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { fetchPayments, type ApiPayment } from "../../services/admin-api";

type PaymentStatusFilter = "all" | ApiPayment["status"];

const statusLabels: Record<ApiPayment["status"], string> = {
  SUCCESS: "ناجح",
  FAILED: "فشل",
  PENDING: "قيد الانتظار",
};

const methodLabels: Record<ApiPayment["method"], string> = {
  CASH: "نقدي",
  CARD: "بطاقة",
  ONLINE: "أونلاين",
};

const formatSar = (value?: string | null) => {
  if (!value) {
    return "0 ر.س";
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return `${value} ر.س`;
  }
  return `${numeric.toLocaleString("ar-EG")} ر.س`;
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("all");
  const [methodFilter, setMethodFilter] = useState<"all" | ApiPayment["method"]>(
    "all"
  );
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadError(null);
      try {
        const data = await fetchPayments();
        setPayments(data);
      } catch (error) {
        const status =
          typeof error === "object" && error && "status" in error
            ? String((error as { status?: number }).status)
            : "";
        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message?: string }).message)
            : "";
        if (status === "401") {
          setLoadError("انتهت صلاحية التوكن. من فضلك سجّل الدخول مرة أخرى.");
        } else if (message) {
          setLoadError(`تعذر تحميل المدفوعات من الباك. (${message})`);
        } else {
          setLoadError("تعذر تحميل المدفوعات من الباك. تأكد من الاتصال والتوكن.");
        }
        setPayments([]);
      }
    };
    load();
  }, []);

  const methodOptions = useMemo(() => {
    return Array.from(new Set(payments.map((payment) => payment.method)));
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const trimmed = search.trim();
    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      const matchesMethod =
        methodFilter === "all" || payment.method === methodFilter;
      if (!matchesStatus || !matchesMethod) {
        return false;
      }
      if (!trimmed) {
        return true;
      }
      return String(payment.order).includes(trimmed);
    });
  }, [payments, statusFilter, methodFilter, search]);

  const summary = useMemo(() => {
    const totalCount = payments.length;
    const successCount = payments.filter((p) => p.status === "SUCCESS").length;
    const failedCount = payments.filter((p) => p.status === "FAILED").length;
    const totalAmount = payments
      .filter((p) => p.status === "SUCCESS")
      .reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const successRate = totalCount
      ? Math.round((successCount / totalCount) * 100)
      : 0;
    return { totalCount, successCount, failedCount, totalAmount, successRate };
  }, [payments]);

  const summaryCards = [
    {
      title: "إجمالي المدفوعات",
      value: formatSar(String(summary.totalAmount)),
      meta: "إجمالي المدفوعات الناجحة",
      icon: <FiDollarSign />,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "مدفوعات ناجحة",
      value: String(summary.successCount),
      meta: `${summary.successRate}% معدل النجاح`,
      icon: <FiCreditCard />,
      tone: "bg-blue-50 text-blue-600",
    },
    {
      title: "مدفوعات فاشلة",
      value: String(summary.failedCount),
      meta: "تحتاج المراجعة",
      icon: <FiCreditCard />,
      tone: "bg-rose-50 text-rose-600",
    },
  ];

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
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as PaymentStatusFilter)
              }
              className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-700"
            >
              <option value="all">جميع الحالات</option>
              <option value="SUCCESS">ناجح</option>
              <option value="FAILED">فشل</option>
              <option value="PENDING">قيد الانتظار</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={methodFilter}
              onChange={(event) =>
                setMethodFilter(event.target.value as "all" | ApiPayment["method"])
              }
              className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-700"
            >
              <option value="all">جميع الطرق</option>
              {methodOptions.map((method) => (
                <option key={method} value={method}>
                  {methodLabels[method]}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
          <FiSearch />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث عن طلب..."
            className="w-56 bg-transparent text-right outline-none"
          />
        </div>
      </section>

      {loadError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {loadError}
        </div>
      ) : null}

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
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl ${card.tone}`}
            >
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

        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className="grid grid-cols-[140px_1fr_1fr_1fr_1fr_1fr] items-center border-b border-slate-100 px-5 py-3 text-sm text-slate-700 last:border-b-0"
          >
            <div className="text-right font-semibold">PAY-{payment.id}#</div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">#{payment.order}</p>
              <p className="text-xs text-slate-400">الطلب</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">
                {formatSar(payment.amount)}
              </p>
            </div>
            <div className="text-right">{methodLabels[payment.method]}</div>
            <div className="text-right">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  payment.status === "SUCCESS"
                    ? "bg-emerald-50 text-emerald-600"
                    : payment.status === "PENDING"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600"
                }`}
              >
                {statusLabels[payment.status]}
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">
                {formatTime(payment.paid_at ?? payment.created_at)}
              </p>
              <p className="text-xs text-slate-400">
                {formatDate(payment.paid_at ?? payment.created_at)}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

