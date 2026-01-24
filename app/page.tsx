import Link from "next/link";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const socials = [
  { label: "WhatsApp", href: "#", icon: "wa" },
  { label: "X", href: "#", icon: "x" },
  { label: "Instagram", href: "#", icon: "ig" },
  { label: "Facebook", href: "#", icon: "fb" },
];

export default function Home() {
  return (
    <div
      className={`${cairo.className} relative min-h-screen overflow-hidden bg-[radial-gradient(900px_circle_at_8%_-10%,#fff0e6,transparent_55%),radial-gradient(900px_circle_at_95%_25%,#ffe7d9,transparent_55%),linear-gradient(180deg,#fff7f0_0%,#fffaf6_45%,#ffffff_100%)] text-slate-900`}
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffd7c2,transparent_60%)] opacity-70" />
      <div className="pointer-events-none absolute -right-24 top-36 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffcaa9,transparent_60%)] opacity-60" />

      <header className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10">
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-orange-600 shadow-[0_8px_24px_rgba(232,110,62,0.18)] ring-1 ring-orange-100">
          A
        </button>
        <div className="text-xs text-slate-400">EN</div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-6 text-center sm:px-10">
        <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_18px_40px_rgba(232,110,62,0.2)]">
          <div className="absolute inset-0 rounded-full border-[5px] border-orange-200" />
          <div className="absolute inset-2 rounded-full border-[4px] border-orange-400" />
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-orange-100 text-orange-600">
            <div className="grid h-8 w-8 grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-sm bg-orange-500"
                />
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          welcomeTitle
        </h1>
        <p className="mt-2 text-base text-slate-500 sm:text-lg">
          مطعم الذواقة
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-4">
          <Link
            href="/menu"
            className="flex items-center justify-center gap-3 rounded-2xl border border-orange-300 bg-white px-6 py-4 text-base font-semibold text-orange-600 shadow-[0_10px_24px_rgba(234,130,70,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(234,130,70,0.18)]"
          >
            <span className="text-lg">🍴</span>
            viewMenuOnly
          </Link>
          <button className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(234,106,54,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(234,106,54,0.4)]">
            <span className="text-lg">🍽️</span>
            orderFromTable
          </button>
        </div>
      </main>

      <section className="relative z-10 border-t border-orange-100 bg-white/70 px-6 py-10 backdrop-blur sm:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <p className="text-sm font-semibold text-slate-500">followUs</p>
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_18px_rgba(148,163,184,0.2)] ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:text-orange-500"
                aria-label={social.label}
              >
                {social.icon === "wa" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 4a7.8 7.8 0 0 0-6.8 11.7L4 20l4.5-1.2A7.8 7.8 0 1 0 12 4Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.6 9.4c.3-.6.6-.6.9-.6.2 0 .4 0 .6.4l.6 1.4c.1.3 0 .6-.2.8l-.4.5c.4.8 1.2 1.6 2 2l.6-.4c.2-.2.5-.2.8 0l1.3.6c.3.1.4.3.4.6 0 .4 0 .7-.6 1-1.2.6-3.2.2-5.2-1.8-2-2-2.4-4-1.8-5.2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {social.icon === "x" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 5h3.5l3.4 4.6L17 5h3l-5.5 6.6L20.5 19h-3.5l-3.7-4.9L9 19H6l5.8-6.8L6 5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {social.icon === "ig" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="16"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
                  </svg>
                )}
                {social.icon === "fb" && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M13.5 8.5V7.2c0-.8.4-1.2 1.3-1.2h1.2V3.8h-2c-2.1 0-3.3 1.2-3.3 3.4v1.3H9v2.3h1.7V20h2.8v-9.2h2.1l.4-2.3h-2.5Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </a>
            ))}
          </div>
          <p className="text-xs text-slate-400">allRightsReserved © 2025</p>
        </div>
      </section>

      <button className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,0,0,0.2)]">
        Talk with Us
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
          💬
        </span>
      </button>
    </div>
  );
}
