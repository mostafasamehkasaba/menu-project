import Link from "next/link";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const categories = [
  { id: "all", label: "الكل", icon: "✦", href: "/menu" },
  { id: "apps", label: "مقبلات", icon: "🥗", active: true, href: "/menu/appetizers" },
  { id: "mains", label: "وجبات رئيسية", icon: "🍔", href: "/menu/mains" },
  { id: "drinks", label: "مشروبات", icon: "🥤", href: "/menu/drinks" },
  { id: "desserts", label: "حلويات", icon: "🍰", href: "/menu" },
];

const appetizers = [
  {
    id: 1,
    name: "حلقات البصل",
    desc: "حلقات بصل مقرمشة مع صوص الرانش",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "سلطة سيزر",
    desc: "خس روماني طازج مع صوص السيزر والبارميزان المحمص",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "أصابع موتزاريلا",
    desc: "موتزاريلا ذائبة بقشرة ذهبية",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "بطاطس ودجز",
    desc: "بطاطس متبلة مع صوص الثوم",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function AppetizersPage() {
  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold sm:text-2xl">صفحة المقبلات</h1>
          <div className="flex flex-wrap items-center gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_18px_rgba(15,23,42,0.08)] ${
                  category.active
                    ? "bg-orange-500 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </Link>
            ))}
          </div>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {appetizers.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-52 w-full object-cover"
                loading="lazy"
              />
              <div className="relative px-6 pb-6 pt-4 text-sm">
                <h2 className="text-base font-semibold">{item.name}</h2>
                <p className="mt-1 text-slate-500">{item.desc}</p>
                <p className="mt-3 text-orange-500">egp {item.price}</p>
                <button className="absolute -left-4 -bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl text-white shadow-[0_10px_18px_rgba(234,106,54,0.35)]">
                  +
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      <button className="fixed bottom-20 right-6 flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,0,0,0.2)]">
        Talk with Us
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
          💬
        </span>
      </button>
    </div>
  );
}
