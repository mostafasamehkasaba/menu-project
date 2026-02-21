import type { MenuCategory, MenuExtra, MenuItem, OfferItem } from "../../lib/menu-data";

export type MenuCatalog = {
  categories: MenuCategory[];
  items: MenuItem[];
  offers: OfferItem[];
};

const makeExtra = (
  id: string,
  ar: string,
  en: string,
  price: number
): MenuExtra => ({
  id,
  label: { ar, en },
  price,
});

const extras: MenuExtra[] = [
  makeExtra("extra-1", "جبن إضافي", "Extra cheese", 6),
  makeExtra("extra-2", "صوص ثوم", "Garlic sauce", 4),
  makeExtra("extra-3", "أفوكادو", "Avocado", 8),
];

export const menuV2Items: MenuItem[] = [
  {
    id: 101,
    name: { ar: "شكشوكة كلاسيك", en: "Classic Shakshuka" },
    desc: {
      ar: "بيض طازج مع صلصة طماطم وتوابل شرقية.",
      en: "Eggs in rich tomato sauce with spices.",
    },
    price: 48,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    extras,
  },
  {
    id: 102,
    name: { ar: "توست أفوكادو", en: "Avocado Toast" },
    desc: {
      ar: "توست حبوب كاملة مع أفوكادو وليمون.",
      en: "Whole-grain toast with avocado and lemon.",
    },
    price: 44,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 103,
    name: { ar: "بانكيك بالعسل", en: "Honey Pancakes" },
    desc: {
      ar: "بانكيك طري مع عسل طبيعي وفاكهة.",
      en: "Fluffy pancakes with honey and fruit.",
    },
    price: 42,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 104,
    name: { ar: "جبنة حلومي مشوية", en: "Grilled Halloumi" },
    desc: {
      ar: "جبنة حلومي مع خضار مشوي وزعتر.",
      en: "Halloumi with grilled veggies and thyme.",
    },
    price: 46,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 201,
    name: { ar: "برجر لحم", en: "Beef Burger" },
    desc: {
      ar: "برجر لحم طازج مع صوص خاص.",
      en: "Juicy beef burger with house sauce.",
    },
    price: 78,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 202,
    name: { ar: "سلطة دجاج مشوي", en: "Grilled Chicken Salad" },
    desc: {
      ar: "خضار موسمية مع دجاج مشوي.",
      en: "Seasonal greens with grilled chicken.",
    },
    price: 64,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 203,
    name: { ar: "باستا ألفريدو", en: "Alfredo Pasta" },
    desc: {
      ar: "صوص كريمي مع فطر طازج.",
      en: "Creamy sauce with fresh mushrooms.",
    },
    price: 72,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 204,
    name: { ar: "سندويتش تركي", en: "Turkey Sandwich" },
    desc: {
      ar: "خبز طازج مع تركي مدخن.",
      en: "Fresh bread with smoked turkey.",
    },
    price: 58,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 301,
    name: { ar: "ستيك مشوي", en: "Grilled Steak" },
    desc: {
      ar: "ستيك لحم مع صوص فلفل.",
      en: "Steak with pepper sauce.",
    },
    price: 140,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 302,
    name: { ar: "ريزوتو فطر", en: "Mushroom Risotto" },
    desc: {
      ar: "أرز إيطالي كريمي مع فطر.",
      en: "Creamy Italian rice with mushrooms.",
    },
    price: 98,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 303,
    name: { ar: "سلمون مشوي", en: "Grilled Salmon" },
    desc: {
      ar: "سلمون طازج مع خضار موسمية.",
      en: "Fresh salmon with seasonal veggies.",
    },
    price: 125,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 304,
    name: { ar: "طبق بحري", en: "Seafood Platter" },
    desc: {
      ar: "تشكيلة بحرية مع صوص ليمون.",
      en: "Seafood selection with lemon sauce.",
    },
    price: 160,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
  },
];

export const menuV2Catalog: MenuCatalog = {
  categories: [
    { id: "all", label: { ar: "الكل", en: "All" }, icon: "✦" },
    { id: "breakfast", label: { ar: "إفطار", en: "Breakfast" }, icon: "☕" },
    { id: "lunch", label: { ar: "غداء", en: "Lunch" }, icon: "🥗" },
    { id: "dinner", label: { ar: "عشاء", en: "Dinner" }, icon: "🍽️" },
  ],
  items: menuV2Items,
  offers: [
    {
      id: 901,
      title: { ar: "عرض اليوم", en: "Today Offer" },
      desc: { ar: "خصم 15% على طبق الإفطار.", en: "15% off breakfast dish." },
      price: 35,
      oldPrice: 41,
      badge: "15%",
      image:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 902,
      title: { ar: "باستا مميزة", en: "Signature Pasta" },
      desc: { ar: "طبق باستا بسعر خاص.", en: "Pasta dish special price." },
      price: 62,
      oldPrice: 72,
      badge: "New",
      image:
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=900&q=80",
    },
  ],
};
