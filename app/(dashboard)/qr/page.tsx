"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCode, FiCopy, FiDownload } from "react-icons/fi";
import {
  fetchQrCodes,
  fetchQrSettings,
  generateQrCode,
  updateQrSettings,
  type ApiQRCode,
  type ApiQRSettings,
} from "../../services/admin-api";
import { getApiBaseUrl } from "../../services/api-client";

const resolveUrl = (value?: string | null) => {
  if (!value) {
    return "";
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  const base = getApiBaseUrl();
  return base ? `${base}${value}` : value;
};

export default function QrPage() {
  const [settings, setSettings] = useState<ApiQRSettings | null>(null);
  const [qrCodes, setQrCodes] = useState<ApiQRCode[]>([]);
  const [selectedQr, setSelectedQr] = useState<ApiQRCode | null>(null);
  const [type, setType] = useState<ApiQRCode["type"]>("MENU_ONLY");
  const [tableId, setTableId] = useState("");
  const [includeLogo, setIncludeLogo] = useState(true);
  const [coloredFrame, setColoredFrame] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadError(null);
      const [settingsData, qrData] = await Promise.all([
        fetchQrSettings(),
        fetchQrCodes(),
      ]);
      if (!settingsData) {
        setLoadError("تعذر تحميل إعدادات QR. تأكد من الاتصال والتوكن.");
      }
      setSettings(settingsData);
      if (settingsData) {
        setType(settingsData.default_qr_type);
        setIncludeLogo(Boolean(settingsData.include_logo_default));
        setColoredFrame(Boolean(settingsData.colored_frame_default));
      }
      if (!qrData) {
        setLoadError((prev) =>
          prev ? prev : "تعذر تحميل رموز QR الحالية."
        );
        setQrCodes([]);
      } else {
        setQrCodes(qrData);
        setSelectedQr(qrData[0] ?? null);
      }
    };
    load();
  }, []);

  const previewUrl = useMemo(() => {
    return resolveUrl(selectedQr?.png_file || selectedQr?.svg_file || "");
  }, [selectedQr]);

  const handleGenerate = async () => {
    if (type === "TABLE_MENU" && !tableId) {
      setActionError("اختر رقم الطاولة قبل إنشاء QR.");
      return;
    }
    setActionError(null);
    try {
      const qr = await generateQrCode({
        type,
        table_id: type === "TABLE_MENU" ? Number(tableId) : null,
        include_logo: includeLogo,
        colored_frame: coloredFrame,
      });
      setSelectedQr(qr);
      setQrCodes((prev) => [qr, ...prev]);
    } catch (error) {
      const message =
        (error as { message?: string })?.message ?? "تعذر إنشاء رمز QR.";
      setActionError(message);
    }
  };

  const handleCopyBaseUrl = async () => {
    if (!settings?.base_url) {
      return;
    }
    try {
      await navigator.clipboard.writeText(settings.base_url);
    } catch {
      // ignore
    }
  };

  const handleToggleSetting = async (key: "include_logo_default" | "colored_frame_default") => {
    if (!settings) {
      return;
    }
    const nextValue =
      key === "include_logo_default" ? !includeLogo : !coloredFrame;
    try {
      const updated = await updateQrSettings({
        [key]: nextValue,
      });
      setSettings(updated);
      if (key === "include_logo_default") {
        setIncludeLogo(Boolean(updated.include_logo_default));
      } else {
        setColoredFrame(Boolean(updated.colored_frame_default));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      <header className="text-right">
        <h1 className="text-lg font-semibold text-slate-900">مولد رمز QR</h1>
        <p className="text-sm text-slate-500">
          إنشاء وتحميل رمز QR للقائمة والطاولات
        </p>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {loadError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-right">
            <h2 className="text-sm font-semibold text-slate-900">معاينة رمز QR</h2>
            <p className="text-xs text-slate-400">معاينة الرمز قبل التحميل</p>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="QR"
                  className="h-44 w-44 rounded-2xl object-contain"
                />
              ) : (
                <div className="grid h-44 w-44 place-items-center rounded-2xl bg-emerald-50 text-emerald-400">
                  <FiCode className="text-6xl" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-semibold text-slate-900">
              {selectedQr?.type === "TABLE_MENU"
                ? `رمز الطاولة ${selectedQr.table ?? ""}`
                : "رمز القائمة"}
            </p>
            <p className="text-xs text-slate-400">
              اضغط على "إنشاء" لتوليد الرمز
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "PNG", url: resolveUrl(selectedQr?.png_file) },
              { label: "SVG", url: resolveUrl(selectedQr?.svg_file) },
              { label: "PDF", url: resolveUrl(selectedQr?.pdf_file) },
            ].map((item) => (
              <a
                key={item.label}
                href={item.url || "#"}
                className={`flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 ${
                  item.url ? "" : "pointer-events-none opacity-50"
                }`}
              >
                {item.label}
                <FiDownload />
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-right">
            <h2 className="text-sm font-semibold text-slate-900">إنشاء سريع</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "رمز القائمة الرئيسية",
                note: "عرض فقط",
                tone: "bg-blue-50 text-blue-600",
                type: "MENU_ONLY" as const,
              },
              {
                title: "رمز طاولة",
                note: "حدد رقم طاولة",
                tone: "bg-emerald-50 text-emerald-600",
                type: "TABLE_MENU" as const,
              },
              {
                title: "إعادة إنشاء",
                note: "آخر إعدادات",
                tone: "bg-orange-50 text-orange-600",
                type,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 p-5 text-center"
              >
                <span className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${item.tone}`}>
                  <FiCode />
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400">{item.note}</p>
                <button
                  type="button"
                  onClick={() => {
                    setType(item.type);
                    handleGenerate();
                  }}
                  className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  تحميل
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-right">
            <h2 className="text-sm font-semibold text-slate-900">إعدادات رمز QR</h2>
            <p className="text-xs text-slate-400">
              حدد نوع رمز QR الذي تريد إنشاؤه
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">رابط القائمة</p>
              <div className="mt-2 flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span className="break-all">{settings?.base_url ?? "-"}</span>
                <button
                  type="button"
                  onClick={handleCopyBaseUrl}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500"
                >
                  <FiCopy />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">نوع رمز QR</p>
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as ApiQRCode["type"])
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 outline-none"
              >
                <option value="MENU_ONLY">قائمة فقط</option>
                <option value="TABLE_MENU">قائمة مع الطاولة</option>
              </select>
            </div>

            {type === "TABLE_MENU" ? (
              <div>
                <p className="text-sm font-semibold text-slate-700">رقم الطاولة</p>
                <input
                  type="number"
                  value={tableId}
                  onChange={(event) => setTableId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 outline-none"
                  placeholder="مثال: 5"
                />
              </div>
            ) : null}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">تضمين الشعار</span>
                <button
                  type="button"
                  onClick={() => handleToggleSetting("include_logo_default")}
                  className={`relative h-6 w-11 rounded-full ${
                    includeLogo ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                      includeLogo ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">إطار ملون</span>
                <button
                  type="button"
                  onClick={() => handleToggleSetting("colored_frame_default")}
                  className={`relative h-6 w-11 rounded-full ${
                    coloredFrame ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                      coloredFrame ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {actionError ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-right text-sm text-rose-600">
                {actionError}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleGenerate}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
            >
              إنشاء رمز QR
              <FiCode />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

