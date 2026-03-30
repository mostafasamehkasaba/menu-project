"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCode, FiCopy, FiDownload } from "react-icons/fi";
import {
  fetchQrCodes,
  fetchQrSettings,
  fetchTables,
  generateQrCode,
  uploadQrLogo,
  updateQrSettings,
  type ApiQRCode,
  type ApiQRSettings,
  type ApiTable,
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
  const [selectedQr, setSelectedQr] = useState<ApiQRCode | null>(null);
  const [tables, setTables] = useState<ApiTable[]>([]);
  const [type, setType] = useState<ApiQRCode["type"]>("MENU_ONLY");
  const [tableId, setTableId] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [includeLogo, setIncludeLogo] = useState(true);
  const [coloredFrame, setColoredFrame] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadError(null);
      const [settingsData, qrData, tablesData] = await Promise.all([
        fetchQrSettings(),
        fetchQrCodes(),
        fetchTables(),
      ]);
      if (!settingsData) {
        setLoadError("تعذر تحميل إعدادات QR. تأكد من الاتصال والتوكن.");
      }
      setSettings(settingsData);
      if (settingsData) {
        const logoAvailable = Boolean(settingsData.logo);
        setBaseUrl(settingsData.base_url ?? "");
        setType(settingsData.default_qr_type);
        setIncludeLogo(Boolean(settingsData.include_logo_default) && logoAvailable);
        setColoredFrame(Boolean(settingsData.colored_frame_default));
      }
      if (!qrData) {
        setLoadError((prev) =>
          prev ? prev : "تعذر تحميل رموز QR الحالية."
        );
      } else {
        setSelectedQr(qrData[0] ?? null);
      }
      if (tablesData) {
        setTables(tablesData);
      } else {
        setTables([]);
      }
    };
    load();
  }, []);

  const previewUrl = useMemo(() => {
    return resolveUrl(selectedQr?.png_file || selectedQr?.svg_file || "");
  }, [selectedQr]);

  const resolveType = (value?: unknown): ApiQRCode["type"] | null => {
    if (value === "MENU_ONLY" || value === "TABLE_MENU") {
      return value;
    }
    return null;
  };
  const hasLogo = Boolean(settings?.logo);
  const logoName = logoFile?.name ?? "";

  const handleGenerate = async (overrideType?: ApiQRCode["type"] | unknown) => {
    if (includeLogo && !hasLogo) {
      setActionError("لا يوجد شعار مرفوع. عطّل تضمين الشعار أو ارفع الشعار أولاً.");
      return;
    }
    const nextType = resolveType(overrideType) ?? type;
    if (nextType === "TABLE_MENU" && !tableId) {
      setActionError("اختر رقم الطاولة قبل إنشاء QR.");
      return;
    }
    const selectedTable =
      tables.find((table) => String(table.id) === tableId) ??
      tables.find((table) => String(table.number) === tableId);
    const tableIdValue = selectedTable?.id ?? Number(tableId);
    const tableNumberValue = selectedTable?.number ?? Number(tableId);
    if (
      nextType === "TABLE_MENU" &&
      !Number.isFinite(tableIdValue) &&
      !Number.isFinite(tableNumberValue)
    ) {
      setActionError("رقم الطاولة غير صالح.");
      return;
    }
    setActionError(null);
    try {
      const qr = await generateQrCode({
        type: nextType,
        table_id:
          nextType === "TABLE_MENU" && Number.isFinite(tableIdValue)
            ? tableIdValue
            : undefined,
        table_number:
          nextType === "TABLE_MENU" && Number.isFinite(tableNumberValue)
            ? tableNumberValue
            : undefined,
        include_logo: includeLogo,
        colored_frame: coloredFrame,
      });
      setSelectedQr(qr);
    } catch (error) {
      const message =
        (error as { message?: string })?.message ?? "تعذر إنشاء رمز QR.";
      setActionError(message);
    }
  };

  const handleCopyBaseUrl = async () => {
    const value = baseUrl || settings?.base_url;
    if (!value) {
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch {
      // ignore
    }
  };

  const handleToggleSetting = (key: "include_logo_default" | "colored_frame_default") => {
    if (key === "include_logo_default") {
      if (!includeLogo && !hasLogo) {
        setSettingsError("لا يوجد شعار مرفوع لتضمينه. ارفع الشعار أولاً.");
        return;
      }
      setIncludeLogo((prev) => !prev);
    } else {
      setColoredFrame((prev) => !prev);
    }
  };

  const handleSaveSettings = async () => {
    const trimmedBaseUrl = baseUrl.trim();
    if (!trimmedBaseUrl) {
      setSettingsError("ادخل رابط القائمة أولاً.");
      return;
    }
    if (includeLogo && !hasLogo) {
      setSettingsError("لا يوجد شعار مرفوع لتضمينه. ارفع الشعار أولاً.");
      return;
    }
    setSettingsError(null);
    setIsSavingSettings(true);
    try {
      const updated = await updateQrSettings({
        base_url: trimmedBaseUrl,
        default_qr_type: type,
        include_logo_default: includeLogo,
        colored_frame_default: coloredFrame,
      });
      setSettings(updated);
      setBaseUrl(updated.base_url ?? trimmedBaseUrl);
      setType(updated.default_qr_type ?? type);
      setIncludeLogo(Boolean(updated.include_logo_default));
      setColoredFrame(Boolean(updated.colored_frame_default));
    } catch (error) {
      const message =
        (error as { message?: string })?.message ?? "تعذر حفظ الإعدادات.";
      setSettingsError(message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setLogoFile(file);
    setLogoError(null);
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      setLogoError("اختر ملف الشعار أولاً.");
      return;
    }
    setLogoError(null);
    setIsUploadingLogo(true);
    try {
      const updated = await uploadQrLogo(logoFile);
      setSettings(updated);
      setBaseUrl(updated.base_url ?? baseUrl);
      setType(updated.default_qr_type ?? type);
      setIncludeLogo(Boolean(updated.include_logo_default));
      setColoredFrame(Boolean(updated.colored_frame_default));
      setLogoFile(null);
    } catch (error) {
      const message =
        (error as { message?: string })?.message ?? "تعذر رفع الشعار.";
      setLogoError(message);
    } finally {
      setIsUploadingLogo(false);
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

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <div className="text-right">
            <h2 className="text-sm font-semibold text-slate-900">معاينة رمز QR</h2>
            <p className="text-xs text-slate-400">عاين الرمز قبل التحميل</p>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
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
              اضغط على &quot;إنشاء&quot; لتوليد الرمز
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

        <div className="space-y-6">
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
                      handleGenerate(item.type);
                    }}
                    className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    توليد
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-right">
              <h2 className="text-sm font-semibold text-slate-900">إعدادات رمز QR</h2>
              <p className="text-xs text-slate-400">
                حدد إعدادات الرمز الذي تريد توليده
              </p>
            </div>

            <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">رابط القائمة</p>
              <div className="mt-2 flex flex-col gap-3 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(event) => setBaseUrl(event.target.value)}
                  onFocus={(event) => event.currentTarget.select()}
                  className="w-full bg-transparent text-right outline-none"
                  placeholder="-"
                />
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
                {tables.length ? (
                  <select
                    value={tableId}
                    onChange={(event) => setTableId(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 outline-none"
                  >
                    <option value="">اختر طاولة</option>
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        طاولة {table.number} - {table.capacity} مقاعد
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={tableId}
                    onChange={(event) => setTableId(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 outline-none"
                    placeholder="مثال: 5"
                  />
                )}
              </div>
            ) : null}

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">شعار المطعم</p>
                {hasLogo ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    شعار مرفوع
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    لا يوجد شعار
                  </span>
                )}
              </div>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-slate-200 bg-white">
                      {settings?.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveUrl(settings.logo)}
                          alt="Logo"
                          className="h-12 w-12 object-contain"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">لا يوجد</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        ارفع شعار المطعم
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG أو JPG، يفضل 300x300
                      </p>
                      {logoName ? (
                        <p className="mt-1 text-xs text-emerald-600">
                          الملف المختار: {logoName}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="sr-only"
                      />
                      اختيار ملف
                    </label>
                    <button
                      type="button"
                      onClick={handleUploadLogo}
                      disabled={isUploadingLogo}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUploadingLogo ? "جارٍ الرفع..." : "رفع الشعار"}
                    </button>
                  </div>
                </div>
              </div>
              {logoError ? (
                <div className="mt-2 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-right text-sm text-rose-600">
                  {logoError}
                </div>
              ) : null}
            </div>

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
              {!hasLogo ? (
                <p className="text-xs text-rose-500">
                  لا يوجد شعار مرفوع. ارفع الشعار أولاً لتفعيل التضمين.
                </p>
              ) : null}
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

            {settingsError ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-right text-sm text-rose-600">
                {settingsError}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingSettings ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
              </button>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
              >
                إنشاء رمز QR
                <FiCode />
              </button>
            </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}




