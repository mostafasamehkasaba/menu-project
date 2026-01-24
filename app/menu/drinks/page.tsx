import Link from "next/link";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const categories = [
  { id: "all", label: "الكل", icon: "✦", href: "/menu" },
  { id: "apps", label: "مقبلات", icon: "🥗", href: "/menu/appetizers" },
  { id: "mains", label: "وجبات رئيسية", icon: "🍔", href: "/menu/mains" },
  { id: "drinks", label: "مشروبات", icon: "🥤", active: true, href: "/menu/drinks" },
  { id: "desserts", label: "حلويات", icon: "🍰", href: "/menu" },
];

const drinks = [
  {
    id: 1,
    name: "موهيتو",
    desc: "مشروب منعش بالنعناع والليمون",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "عصير برتقال طازج",
    desc: "عصير برتقال طبيعي 100% بدون إضافات",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "سموثي فراولة",
    desc: "فراولة طازجة مع حليب",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "ليمون بالنعناع",
    desc: "ليمون فريش مع نعناع",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1464306076886-da185f6a9d2d?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function DrinksPage() {
  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold sm:text-2xl">صفحة المشروبات</h1>
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
          {drinks.map((item) => (
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
