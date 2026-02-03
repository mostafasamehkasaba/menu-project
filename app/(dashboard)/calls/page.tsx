"use client";

import { useState, type ReactNode } from "react";
import {
  FiAlertTriangle,
  FiChevronDown,
  FiClock,
  FiDollarSign,
  FiHelpCircle,
  FiPlusCircle,
  FiX,
} from "react-icons/fi";

type CallStatus = "new" | "handled";

type CallType = "billing" | "help" | "extra" | "issue";

type Call = {
  id: number;
  table: number;
  time: string;
  since: string;
  type: CallType;
  status: CallStatus;
};

const callTypeMeta: Record<
  CallType,
  { label: string; icon: ReactNode; tone: string }
> = {
  billing: {
    label: "عايز حساب",
    icon: <FiDollarSign />,
    tone: "text-blue-600",
  },
  help: {
    label: "مساعدة",
    icon: <FiHelpCircle />,
    tone: "text-violet-600",
  },
  extra: {
    label: "طلب إضافي",
    icon: <FiPlusCircle />,
    tone: "text-orange-600",
  },
  issue: {
    label: "مشكلة",
    icon: <FiAlertTriangle />,
    tone: "text-rose-600",
  },
};

const calls: Call[] = [
  {
    id: 1,
    table: 3,
    time: "14:45",
    since: "منذ 5 دقائق",
    type: "billing",
    status: "new",
  },
  {
    id: 2,
    table: 7,
    time: "14:40",
    since: "منذ 10 دقائق",
    type: "help",
    status: "new",
  },
  {
    id: 3,
    table: 5,
    time: "14:35",
    since: "منذ 15 دقيقة",
    type: "extra",
    status: "handled",
  },
  {
    id: 4,
    table: 2,
    time: "14:30",
    since: "منذ 20 دقيقة",
    type: "issue",
    status: "handled",
  },
  {
    id: 5,
    table: 9,
    time: "14:25",
    since: "منذ 25 دقيقة",
    type: "billing",
    status: "handled",
  },
];

const statusPills: Record<CallStatus, { label: string; className: string }> = {
  new: { label: "جديد", className: "bg-rose-50 text-rose-600" },
  handled: { label: "تم التعامل", className: "bg-emerald-50 text-emerald-600" },
};

export default function CallsPage() {
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [typeFilter, setTypeFilter] = useState("الكل");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">طلبات النادل</h1>
          <p className="text-sm text-slate-500">2 طلب جديد - 5 إجمالي</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            الكل
            <FiChevronDown className="text-slate-400" />
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            الكل
            <FiChevronDown className="text-slate-400" />
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[140px_1.2fr_170px_150px_1.2fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
          <div className="text-center">رقم الطاولة</div>
          <div className="text-center">نوع الطلب</div>
          <div className="text-center">الوقت</div>
          <div className="text-center">الحالة</div>
          <div className="text-center">الإجراءات</div>
        </div>

        {calls.map((call) => {
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
                <p className="font-semibold text-slate-900">{call.time}</p>
                <p className="text-xs text-slate-400">{call.since}</p>
              </div>

              <div className="flex justify-center">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                {call.status === "new" ? (
                  <>
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                      إلغاء
                    </button>
                    <button className="flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                      تم التعامل
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-500">تم التعامل ✓</span>
                )}
              </div>

            </div>
          );
        })}
      </section>
    </div>
  );
}
