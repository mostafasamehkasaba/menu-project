"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  FiAlertTriangle,
  FiChevronDown,
  FiClock,
  FiDollarSign,
  FiHelpCircle,
  FiPlusCircle,
} from "react-icons/fi";
import {
  cancelCallRequest,
  fetchCallRequests,
  handleCallRequest,
  type ApiCallRequest,
} from "../../services/admin-api";

type CallStatus = ApiCallRequest["status"];

type CallType = ApiCallRequest["type"];

type CallTypeMeta = {
  label: string;
  icon: ReactNode;
  tone: string;
};

const callTypeMeta: Record<CallType, CallTypeMeta> = {
  BILL_REQUEST: {
    label: "عايز حساب",
    icon: <FiDollarSign />,
    tone: "text-blue-600",
  },
  HELP: {
    label: "مساعدة",
    icon: <FiHelpCircle />,
    tone: "text-violet-600",
  },
  EXTRA_ORDER: {
    label: "طلب إضافي",
    icon: <FiPlusCircle />,
    tone: "text-orange-600",
  },
  PROBLEM: {
    label: "مشكلة",
    icon: <FiAlertTriangle />,
    tone: "text-rose-600",
  },
};

const statusPills: Record<CallStatus, { label: string; className: string }> = {
  NEW: { label: "جديد", className: "bg-rose-50 text-rose-600" },
  HANDLED: { label: "تم التعامل", className: "bg-emerald-50 text-emerald-600" },
  CANCELLED: { label: "ملغي", className: "bg-slate-100 text-slate-500" },
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

const sinceLabel = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) {
    return `منذ ${minutes} دقيقة`;
  }
  const hours = Math.round(minutes / 60);
  return `منذ ${hours} ساعة`;
};

export default function CallsPage() {
  const [calls, setCalls] = useState<ApiCallRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | CallStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | CallType>("all");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadError(null);
      const data = await fetchCallRequests();
      if (!data) {
        setLoadError("تعذر تحميل طلبات النداء. تأكد من الاتصال والتوكن.");
        setCalls([]);
        return;
      }
      setCalls(data);
    };
    load();
  }, []);

  const statusOptions: { value: "all" | CallStatus; label: string }[] = [
    { value: "all", label: "الكل" },
    { value: "NEW", label: statusPills.NEW.label },
    { value: "HANDLED", label: statusPills.HANDLED.label },
    { value: "CANCELLED", label: statusPills.CANCELLED.label },
  ];

  const typeOptions: { value: "all" | CallType; label: string }[] = [
    { value: "all", label: "الكل" },
    { value: "BILL_REQUEST", label: callTypeMeta.BILL_REQUEST.label },
    { value: "HELP", label: callTypeMeta.HELP.label },
    { value: "EXTRA_ORDER", label: callTypeMeta.EXTRA_ORDER.label },
    { value: "PROBLEM", label: callTypeMeta.PROBLEM.label },
  ];

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      const matchesStatus =
        statusFilter === "all" || call.status === statusFilter;
      const matchesType = typeFilter === "all" || call.type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [calls, statusFilter, typeFilter]);

  const openCount = calls.filter((call) => call.status === "NEW").length;

  const handleMarkHandled = async (id: number) => {
    setActionError(null);
    try {
      const updated = await handleCallRequest(id);
      setCalls((prev) =>
        prev.map((call) => (call.id === updated.id ? updated : call))
      );
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر تحديث الطلب.";
      setActionError(message);
    }
  };

  const handleCancel = async (id: number) => {
    setActionError(null);
    try {
      const updated = await cancelCallRequest(id);
      setCalls((prev) =>
        prev.map((call) => (call.id === updated.id ? updated : call))
      );
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر إلغاء الطلب.";
      setActionError(message);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">طلبات النداء</h1>
          <p className="text-sm text-slate-500">{openCount} طلب جديد - {calls.length} إجمالي</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | CallStatus)
              }
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-700 sm:w-auto"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as "all" | CallType)
              }
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-700 sm:w-auto"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {loadError}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {actionError}
        </div>
      ) : null}

      <section className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[140px_1.2fr_170px_150px_1.2fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
            <div className="text-center">رقم الطاولة</div>
            <div className="text-center">نوع الطلب</div>
            <div className="text-center">الوقت</div>
            <div className="text-center">الحالة</div>
            <div className="text-center">الإجراءات</div>
          </div>

          {filteredCalls.map((call) => {
            const typeMeta = callTypeMeta[call.type];
            const status = statusPills[call.status];
            return (
              <div
                key={call.id}
                className="grid grid-cols-[140px_1.2fr_170px_150px_1.2fr] items-center border-b border-slate-100 px-5 py-3 text-sm text-slate-700 last:border-b-0"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    {call.table}
                  </span>
                  <span className="font-semibold">طاولة {call.table}</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className={`text-lg ${typeMeta.tone}`}>
                    {typeMeta.icon}
                  </span>
                  <span className="font-semibold">{typeMeta.label}</span>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-slate-900">
                    {formatTime(call.created_at)}
                  </p>
                  <p className="text-xs text-slate-400">{sinceLabel(call.created_at)}</p>
                </div>

                <div className="flex justify-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {call.status === "NEW" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCancel(call.id)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkHandled(call.id)}
                        className="flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                      >
                        تم التعامل
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500">{status.label}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

