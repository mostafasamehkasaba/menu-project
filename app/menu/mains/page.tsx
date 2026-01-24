import Link from "next/link";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const categories = [
  { id: "all", label: "الكل", icon: "✦", href: "/menu" },
  { id: "apps", label: "مقبلات", icon: "🥗", href: "/menu/appetizers" },
  { id: "mains", label: "وجبات رئيسية", icon: "🍔", active: true, href: "/menu/mains" },
  { id: "drinks", label: "مشروبات", icon: "🥤", href: "/menu/drinks" },
  { id: "desserts", label: "حلويات", icon: "🍰", href: "/menu" },
];

const mains = [
  {
    id: 1,
    name: "بيتزا مارغريتا",
    desc: "بيتزا إيطالية مع صلصة الطماطم والموتزاريلا الطازجة والريحان",
    price: 150,
    tag: "new",
    image:
      "https://images.unsplash.com/photo-1548365328-9f547d9a6f6f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 2,
    name: "برجر لحم فاخر",
    desc: "برجر لحم بقري طازج مع جبن الشيدر والخس والطماطم والصوص الخاص",
    price: 120,
    tag: "hot",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 3,
    name: "دجاج مشوي",
    desc: "صدور دجاج مشوية مع الأرز والخضار المشكلة",
    price: 140,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function MainsPage() {
  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold sm:text-2xl">
            صفحة الوجبات الرئيسية
          </h1>
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
          {mains.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-52 w-full object-cover"
                  loading="lazy"
                />
                {item.tag && (
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      item.tag === "new" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </div>
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
