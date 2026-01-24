import Link from "next/link";

const navItems = [
  { label: "account", icon: "👤" },
  { label: "cart", icon: "🛒", href: "/cart" },
  { label: "book", icon: "📅" },
  { label: "offers", icon: "％", href: "/menu/offers" },
  { label: "menu", icon: "📋", href: "/menu" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-around py-3 text-xs font-semibold text-slate-500">
        {navItems.map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ) : (
            <button
              key={item.label}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          )
        )}
      </div>
    </nav>
  );
}
