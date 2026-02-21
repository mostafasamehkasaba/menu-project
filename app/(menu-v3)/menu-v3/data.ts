import type { MenuCategory, MenuItem } from "../../lib/menu-data";

export type MenuCatalog = {
  categories: MenuCategory[];
  items: MenuItem[];
};

export const menuV3Categories: MenuCategory[] = [
  {
    id: "breakfast",
    label: { ar: "فطور", en: "Breakfast" },
    icon: "☀️",
  },
  {
    id: "lunch",
    label: { ar: "غداء", en: "Lunch" },
    icon: "🍽️",
  },
  {
    id: "dinner",
    label: { ar: "عشاء", en: "Dinner" },
    icon: "🌙",
  },
];

export const menuV3Items: MenuItem[] = [
  {
    id: 301,
    name: { ar: "شكشوكة كلاسيك", en: "Classic Shakshuka" },
    desc: {
      ar: "بيض في صلصة طماطم غنية مع بهارات.",
      en: "Eggs in rich tomato sauce with spices.",
    },
    price: 48,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-feta", label: { ar: "جبنة فيتا", en: "Feta cheese" }, price: 8 },
      { id: "extra-bread", label: { ar: "خبز إضافي", en: "Extra bread" }, price: 5 },
    ],
  },
  {
    id: 302,
    name: { ar: "بانكيك بالعسل", en: "Honey Pancakes" },
    desc: {
      ar: "بانكيك هش مع عسل وفواكه.",
      en: "Fluffy pancakes with honey and fruit.",
    },
    price: 42,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 303,
    name: { ar: "توست أفوكادو", en: "Avocado Toast" },
    desc: {
      ar: "خبز حبوب كاملة مع أفوكادو طازج.",
      en: "Whole-grain toast with fresh avocado.",
    },
    price: 44,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 304,
    name: { ar: "حلومي مشوي", en: "Grilled Halloumi" },
    desc: {
      ar: "حلومي مشوي مع خضار وأعشاب.",
      en: "Grilled halloumi with herbs and vegetables.",
    },
    price: 46,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 305,
    name: { ar: "برجر لحم", en: "Beef Burger" },
    desc: {
      ar: "برجر لحم مع صوص خاص.",
      en: "Juicy beef burger with house sauce.",
    },
    price: 78,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 306,
    name: { ar: "باستا ألفريدو", en: "Alfredo Pasta" },
    desc: {
      ar: "باستا بصلصة كريمية وفطر.",
      en: "Creamy pasta with fresh mushrooms.",
    },
    price: 72,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 307,
    name: { ar: "سلطة دجاج مشوي", en: "Grilled Chicken Salad" },
    desc: {
      ar: "خضار موسمية مع دجاج مشوي.",
      en: "Seasonal greens with grilled chicken.",
    },
    price: 64,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 308,
    name: { ar: "ساندوتش تركي", en: "Turkey Sandwich" },
    desc: {
      ar: "خبز طازج مع تركي مدخن.",
      en: "Fresh bread with smoked turkey.",
    },
    price: 58,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 309,
    name: { ar: "ستيك مشوي", en: "Grilled Steak" },
    desc: {
      ar: "ستيك طري مع صوص فلفل.",
      en: "Tender steak with pepper sauce.",
    },
    price: 120,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 310,
    name: { ar: "سلمون محمر", en: "Pan-Seared Salmon" },
    desc: {
      ar: "سلمون محمر مع خضار موسمية.",
      en: "Pan-seared salmon with seasonal vegetables.",
    },
    price: 128,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 311,
    name: { ar: "ريزوتو فطر", en: "Mushroom Risotto" },
    desc: {
      ar: "ريزوتو كريمي بنكهة الفطر.",
      en: "Creamy risotto with mushrooms.",
    },
    price: 92,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 312,
    name: { ar: "طبق بحري", en: "Seafood Platter" },
    desc: {
      ar: "تشكيلة بحرية مع صوص الليمون.",
      en: "Seafood selection with lemon sauce.",
    },
    price: 135,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80",
  },
];

export const menuV3Catalog: MenuCatalog = {
  categories: menuV3Categories,
  items: menuV3Items,
};
