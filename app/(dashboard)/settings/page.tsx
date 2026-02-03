"use client";

import { useState } from "react";
import {
  FiBell,
  FiCalendar,
  FiCreditCard,
  FiGlobe,
  FiGrid,
  FiMonitor,
  FiPrinter,
} from "react-icons/fi";

const tabs = [
  { key: "integration", label: "التكامل", icon: <FiGrid /> },
  { key: "invoices", label: "الفواتير", icon: <FiPrinter /> },
  { key: "payments", label: "الدفع", icon: <FiCreditCard /> },
  { key: "appearance", label: "المظهر", icon: <FiMonitor /> },
  { key: "notifications", label: "الإشعارات", icon: <FiBell /> },
  { key: "general", label: "عام", icon: <FiGlobe /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    card: true,
    applePay: true,
    mada: true,
    stc: false,
  });
  const [taxSettings, setTaxSettings] = useState({
    vat: true,
    service: true,
  });
  const [generalSettings, setGeneralSettings] = useState({
    fridayOpen: true,
  });
  const [appearanceSettings, setAppearanceSettings] = useState({
    miniSidebar: false,
    showStats: true,
    animations: true,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    reservations: true,
    failedPayments: true,
    waiterCalls: false,
  });
  const [invoiceSettings, setInvoiceSettings] = useState({
    showLogo: true,
    showTable: true,
    showWaiter: true,
    showQr: true,
    autoPrintAfterPayment: true,
    kitchenCopy: true,
  });
  const [integrationSettings, setIntegrationSettings] = useState({
    stripe: false,
    paytabs: false,
    jahez: false,
    hungerstation: false,
    smsGateway: false,
    whatsapp: false,
  });
  const [integrationFields, setIntegrationFields] = useState({
    stripeKey: "",
    paytabsMerchantId: "",
    smsApiKey: "",
    whatsappPhone: "",
  });

  const fireSaveToast = () => {
    window.dispatchEvent(new Event("app:save"));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">إعدادات النظام</h1>
          <p className="text-sm text-slate-500">
            إدارة إعدادات النظام والتخصيص العام للمطعم
          </p>
        </div>
      </header>

      <div className="flex flex-row-reverse flex-wrap items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
              activeTab === tab.key
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">معلومات المطعم</h2>
          <p className="text-xs text-slate-400">المعلومات الأساسية عن المطعم</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              اسم المطعم (عربي)
            </p>
            <p className="mt-2 text-sm text-slate-600">مطعم الواحة</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              اسم المطعم (إنجليزي)
            </p>
            <p className="mt-2 text-sm text-slate-600">Al Waha Restaurant</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">الوصف (عربي)</p>
            <p className="mt-2 text-sm text-slate-600">
              نقدم أشهى المأكولات العربية والعالمية في أجواء راقية ومريحة
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              الوصف (إنجليزي)
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We offer the finest Arabic and international cuisine in an elegant
              and comfortable atmosphere
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="flex items-start gap-3">
            <FiGlobe className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-700">رقم الهاتف</p>
              <p className="mt-1 text-sm text-slate-600">+966 11 234 5678</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiCalendar className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-700">
                البريد الإلكتروني
              </p>
              <p className="mt-1 text-sm text-slate-600">info@alwaha.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiGlobe className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-700">العنوان</p>
              <p className="mt-1 text-sm text-slate-600">
                شارع الملك فهد، الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>

        <div className="my-6 h-px bg-slate-200" />

        <div>
          <h3 className="text-sm font-semibold text-slate-900">ساعات العمل</h3>
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-2" dir="rtl">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">وقت الفتح</p>
              <p className="mt-2 text-sm text-slate-600">10:00 AM</p>
            </div>
            <FiCalendar className="text-slate-400" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">وقت الإغلاق</p>
              <p className="mt-2 text-sm text-slate-600">11:00 PM</p>
            </div>
            <FiCalendar className="text-slate-400" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <label className="flex items-center gap-3 text-sm text-slate-600">
            <span>مفتوح أيام الجمعة</span>
            <button
              type="button"
              onClick={() =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  fridayOpen: !prev.fridayOpen,
                }))
              }
              aria-pressed={generalSettings.fridayOpen}
              className={`relative h-6 w-11 rounded-full ${
                generalSettings.fridayOpen ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                  generalSettings.fridayOpen ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </label>
        </div>

        <div className="mt-4 flex justify-start">
          <button
            type="button"
            onClick={fireSaveToast}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            حفظ التغييرات
          </button>
        </div>
        </section>
      ) : null}

      {activeTab === "payments" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">إعدادات الدفع</h2>
            <p className="text-xs text-slate-400">إدارة طرق الدفع والضرائب</p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">
                طرق الدفع المتاحة
              </p>

              {[
                { key: "cash", label: "نقدًا" },
                { key: "card", label: "بطاقة ائتمان" },
                { key: "applePay", label: "Apple Pay" },
                { key: "mada", label: "مدى" },
                { key: "stc", label: "STC Pay" },
              ].map((item) => {
                const enabled = paymentMethods[item.key as keyof typeof paymentMethods];
                return (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethods((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }))
                    }
                    aria-pressed={enabled}
                    className={`relative h-6 w-11 rounded-full ${
                      enabled ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        enabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              )})}
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">
                الضرائب والرسوم
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">رسوم الخدمة (%)</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">10</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    ضريبة القيمة المضافة (%)
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">15</p>
                </div>
              </div>

              <div className="space-y-3">
              {[
                { key: "vat", label: "تطبيق الضريبة تلقائيًا" },
                { key: "service", label: "تطبيق رسوم الخدمة تلقائيًا" },
              ].map((item) => {
                const enabled = taxSettings[item.key as keyof typeof taxSettings];
                return (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setTaxSettings((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }))
                    }
                    aria-pressed={enabled}
                    className={`relative h-6 w-11 rounded-full ${
                      enabled ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        enabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              )})}
              </div>
            </div>
          </div>

          <div className="my-6 h-px bg-slate-200" />

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">العملة</p>
              <p className="mt-2 text-sm text-slate-600">ريال سعودي (SAR)</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">رمز العملة</p>
              <p className="mt-2 text-sm text-slate-600">ر.س</p>
            </div>
          </div>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={fireSaveToast}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              حفظ التغييرات
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "appearance" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">إعدادات المظهر</h2>
            <p className="text-xs text-slate-400">تخصيص مظهر لوحة التحكم</p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                اللغة الافتراضية
              </p>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
                العربية
                <span className="text-slate-400">⌄</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">السمة</p>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
                فاتح
                <span className="text-slate-400">⌄</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700">اللون الأساسي</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                "bg-emerald-600",
                "bg-emerald-500",
                "bg-teal-500",
                "bg-lime-500",
                "bg-slate-700",
                "bg-slate-900",
              ].map((color) => (
                <button
                  key={color}
                  className={`h-10 rounded-xl ${color} shadow-sm`}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className="my-6 h-px bg-slate-200" />

          <div>
            <p className="text-sm font-semibold text-slate-700">تفضيلات العرض</p>
            <div className="mt-4 space-y-4">
              {[
                { key: "miniSidebar", label: "عرض شريط جانبي مصغر" },
                { key: "showStats", label: "عرض الإحصائيات في لوحة التحكم" },
                { key: "animations", label: "تفعيل الرسوم المتحركة" },
              ].map((item) => {
                const enabled =
                  appearanceSettings[item.key as keyof typeof appearanceSettings];
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAppearanceSettings((prev) => ({
                          ...prev,
                          [item.key]:
                            !prev[item.key as keyof typeof appearanceSettings],
                        }))
                      }
                      aria-pressed={enabled}
                      className={`relative h-6 w-11 rounded-full ${
                        enabled ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                          enabled ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={fireSaveToast}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              حفظ التغييرات
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "notifications" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              إعدادات الإشعارات
            </h2>
            <p className="text-xs text-slate-400">
              تخصيص تنبيهات النظام والرسائل
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { key: "reservations", label: "تنبيهات الحجوزات الجديدة" },
              { key: "failedPayments", label: "تنبيهات المدفوعات الفاشلة" },
              { key: "waiterCalls", label: "تنبيهات طلبات النادل" },
            ].map((item) => {
              const enabled =
                notificationSettings[
                  item.key as keyof typeof notificationSettings
                ];
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        [item.key]:
                          !prev[item.key as keyof typeof notificationSettings],
                      }))
                    }
                    aria-pressed={enabled}
                    className={`relative h-6 w-11 rounded-full ${
                      enabled ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        enabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={fireSaveToast}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              حفظ التغييرات
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "integration" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">إعدادات التكامل</h2>
            <p className="text-xs text-slate-400">ربط النظام مع خدمات خارجية</p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700">بوابات الدفع</p>
            <div className="mt-4 space-y-4">
              {[
                {
                  key: "stripe",
                  title: "Stripe",
                  subtitle: "معالجة المدفوعات الإلكترونية",
                  fieldLabel: "API Key",
                  fieldKey: "stripeKey",
                },
                {
                  key: "paytabs",
                  title: "PayTabs",
                  subtitle: "بوابة دفع للشرق الأوسط",
                  fieldLabel: "Merchant ID",
                  fieldKey: "paytabsMerchantId",
                },
              ].map((item) => {
                const enabled =
                  integrationSettings[
                    item.key as keyof typeof integrationSettings
                  ];
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            [item.key]:
                              !prev[item.key as keyof typeof integrationSettings],
                          }))
                        }
                        aria-pressed={enabled}
                        className={`relative h-6 w-11 rounded-full ${
                          enabled ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                            enabled ? "left-5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      <p className="font-semibold text-slate-600">
                        {item.fieldLabel}
                      </p>
                      <input
                        type="text"
                        value={
                          integrationFields[
                            item.fieldKey as keyof typeof integrationFields
                          ]
                        }
                        onChange={(event) =>
                          setIntegrationFields((prev) => ({
                            ...prev,
                            [item.fieldKey]: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                        placeholder="أدخل القيمة"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="my-6 h-px bg-slate-200" />

          <div>
            <p className="text-sm font-semibold text-slate-700">التوصيل</p>
            <div className="mt-4 space-y-4">
              {[
                {
                  key: "jahez",
                  title: "Jahez",
                  subtitle: "منصة التوصيل",
                },
                {
                  key: "hungerstation",
                  title: "HungerStation",
                  subtitle: "منصة التوصيل",
                },
              ].map((item) => {
                const enabled =
                  integrationSettings[
                    item.key as keyof typeof integrationSettings
                  ];
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            [item.key]:
                              !prev[item.key as keyof typeof integrationSettings],
                          }))
                        }
                        aria-pressed={enabled}
                        className={`relative h-6 w-11 rounded-full ${
                          enabled ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                            enabled ? "left-5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="my-6 h-px bg-slate-200" />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              الرسائل والإشعارات
            </p>
            <div className="mt-4 space-y-4">
              {[
                {
                  key: "smsGateway",
                  title: "SMS Gateway",
                  subtitle: "إرسال رسائل نصية للعملاء",
                  fieldLabel: "API Key",
                  fieldKey: "smsApiKey",
                },
                {
                  key: "whatsapp",
                  title: "WhatsApp Business",
                  subtitle: "إرسال رسائل واتساب",
                  fieldLabel: "رقم الهاتف",
                  fieldKey: "whatsappPhone",
                },
              ].map((item) => {
                const enabled =
                  integrationSettings[
                    item.key as keyof typeof integrationSettings
                  ];
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setIntegrationSettings((prev) => ({
                            ...prev,
                            [item.key]:
                              !prev[
                                item.key as keyof typeof integrationSettings
                              ],
                          }))
                        }
                        aria-pressed={enabled}
                        className={`relative h-6 w-11 rounded-full ${
                          enabled ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                            enabled ? "left-5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      <p className="font-semibold text-slate-600">
                        {item.fieldLabel}
                      </p>
                      <input
                        type="text"
                        value={
                          integrationFields[
                            item.fieldKey as keyof typeof integrationFields
                          ]
                        }
                        onChange={(event) =>
                          setIntegrationFields((prev) => ({
                            ...prev,
                            [item.fieldKey]: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                        placeholder="أدخل القيمة"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={fireSaveToast}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              حفظ التغييرات
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "invoices" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              إعدادات الفواتير
            </h2>
            <p className="text-xs text-slate-400">
              تخصيص شكل ومحتوى الفواتير
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-sm font-semibold text-slate-700">
              معلومات الفاتورة
            </p>

            {[
              { key: "showLogo", label: "عرض شعار المطعم" },
              { key: "showTable", label: "عرض رقم الطاولة" },
              { key: "showWaiter", label: "عرض اسم النادل" },
              { key: "showQr", label: "عرض QR Code الفاتورة" },
            ].map((item) => {
              const enabled =
                invoiceSettings[item.key as keyof typeof invoiceSettings];
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setInvoiceSettings((prev) => ({
                        ...prev,
                        [item.key]:
                          !prev[item.key as keyof typeof invoiceSettings],
                      }))
                    }
                    aria-pressed={enabled}
                    className={`relative h-6 w-11 rounded-full ${
                      enabled ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        enabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="my-6 h-px bg-slate-200" />

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                رسالة في نهاية الفاتورة (عربي)
              </p>
              <p className="mt-2 text-sm text-slate-600">
                شكرًا لزيارتكم - نتطلع لخدمتكم مجددًا
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                رسالة في نهاية الفاتورة (إنجليزي)
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Thank you for visiting - We look forward to serving you again
              </p>
            </div>
          </div>

          <div className="my-6 h-px bg-slate-200" />

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">الطباعة</p>
              <p className="mt-2 text-sm text-slate-600">حجم الورق</p>
              <p className="text-sm text-slate-600">80mm (حراري)</p>
            </div>
            <div className="space-y-4">
              {[
                { key: "autoPrintAfterPayment", label: "طباعة تلقائية بعد الدفع" },
                { key: "kitchenCopy", label: "طباعة نسخة للمطبخ" },
              ].map((item) => {
                const enabled =
                  invoiceSettings[item.key as keyof typeof invoiceSettings];
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setInvoiceSettings((prev) => ({
                          ...prev,
                          [item.key]:
                            !prev[item.key as keyof typeof invoiceSettings],
                        }))
                      }
                      aria-pressed={enabled}
                      className={`relative h-6 w-11 rounded-full ${
                        enabled ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                          enabled ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={fireSaveToast}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              حفظ التغييرات
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "developer" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">المطور</h2>
            <p className="text-xs text-slate-400">إعدادات المطورين</p>
          </div>
          <div className="mt-6 text-sm text-slate-500">قريبًا...</div>
        </section>
      ) : null}
    </div>
  );
}
