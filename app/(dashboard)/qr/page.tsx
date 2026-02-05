"use client";

import { FiCode, FiCopy, FiDownload } from "react-icons/fi";

export default function QrPage() {
  return (
    <div className="space-y-8">
      <header className="text-right">
        <h1 className="text-lg font-semibold text-slate-900">مولد رمز QR</h1>
        <p className="text-sm text-slate-500">
          إنشاء وتحميل رمز QR للقائمة والطاولات
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-right">
            <h2 className="text-sm font-semibold text-slate-900">
              معاينة رمز QR
            </h2>
            <p className="text-xs text-slate-400">معاينة الرمز قبل التحميل</p>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid h-44 w-44 place-items-center rounded-2xl bg-emerald-50 text-emerald-400">
                <FiCode className="text-6xl" />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-semibold text-slate-900">رمز القائمة</p>
            <p className="text-xs text-slate-400">
              اضغط على &quot;إنشاء&quot; لتوليد الرمز
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["PNG", "SVG", "PDF"].map((label) => (
              <button
                key={label}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                {label}
                <FiDownload />
              </button>
            ))}
          </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-right">
          <h2 className="text-sm font-semibold text-slate-900">إنشاء سريع</h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "رمز القائمة الرئيسية", note: "العرض فقط", tone: "bg-blue-50 text-blue-600" },
            { title: "رموز جميع الطاولات", note: "حزمة كاملة", tone: "bg-emerald-50 text-emerald-600" },
            { title: "رمز الطباعة", note: "جاهز للطباعة", tone: "bg-orange-50 text-orange-600" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 p-5 text-center"
            >
              <span
                className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${item.tone}`}
              >
                <FiCode />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {item.title}
              </p>
              <p className="text-xs text-slate-400">{item.note}</p>
              <button className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                تحميل
              </button>
            </div>
          ))}
        </div>
      </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-right">
            <h2 className="text-sm font-semibold text-slate-900">
              إعدادات رمز QR
            </h2>
            <p className="text-xs text-slate-400">
              حدد نوع رمز QR الذي تريد إنشاؤه
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">رابط القائمة</p>
              <div className="mt-2 flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span className="break-all">https://menu.alwaha-restaurant.com</span>
                <button className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500">
                  <FiCopy />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">نوع رمز QR</p>
              <div className="mt-2 flex flex-col gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                قائمة فقط (العرض)
                <span className="text-slate-400">⌄</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "تضمين الشعار", enabled: true },
                { label: "إطار ملون", enabled: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <span
                    className={`relative h-6 w-11 rounded-full ${
                      item.enabled ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        item.enabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
              إنشاء رمز QR
              <FiCode />
            </button>
          </div>
        </section>
      </div>

    </div>
  );
}
