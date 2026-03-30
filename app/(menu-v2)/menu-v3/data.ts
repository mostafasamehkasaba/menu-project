import type { MenuCategory, MenuItem } from "../../lib/menu-data";

export type MenuCatalog = {
  categories: MenuCategory[];
  items: MenuItem[];
};

export const menuV3Categories: MenuCategory[] = [
  {
    id: "appetizers",
    label: { ar: "مقبلات", en: "Appetizers" },
    icon: "🍟",
  },
  {
    id: "mains",
    label: { ar: "وجبات رئيسية", en: "Mains" },
    icon: "🍔",
  },
  {
    id: "drinks",
    label: { ar: "مشروبات", en: "Drinks" },
    icon: "🥤",
  },
  {
    id: "desserts",
    label: { ar: "حلويات", en: "Desserts" },
    icon: "🍰",
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
    category: "appetizers",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-301-feta", label: { ar: "جبنة فيتا", en: "Feta cheese" }, price: 8 },
      { id: "extra-301-bread", label: { ar: "خبز إضافي", en: "Extra bread" }, price: 5 },
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
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-302-honey", label: { ar: "عسل إضافي", en: "Extra honey" }, price: 4 },
      { id: "extra-302-berries", label: { ar: "توت إضافي", en: "Extra berries" }, price: 6 },
    ],
  },
  {
    id: 303,
    name: { ar: "توست أفوكادو", en: "Avocado Toast" },
    desc: {
      ar: "خبز حبوب كاملة مع أفوكادو طازج.",
      en: "Whole-grain toast with fresh avocado.",
    },
    price: 44,
    category: "appetizers",
    image:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-303-egg", label: { ar: "بيض بوشيه", en: "Poached egg" }, price: 7 },
      { id: "extra-303-cheese", label: { ar: "جبنة كريمية", en: "Cream cheese" }, price: 6 },
    ],
  },
  {
    id: 304,
    name: { ar: "حلومي مشوي", en: "Grilled Halloumi" },
    desc: {
      ar: "حلومي مشوي مع خضار وأعشاب.",
      en: "Grilled halloumi with herbs and vegetables.",
    },
    price: 46,
    category: "appetizers",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-304-herbs", label: { ar: "أعشاب طازجة", en: "Fresh herbs" }, price: 4 },
      { id: "extra-304-sauce", label: { ar: "صوص ليمون", en: "Lemon sauce" }, price: 5 },
    ],
  },
  {
    id: 305,
    name: { ar: "برجر لحم", en: "Beef Burger" },
    desc: {
      ar: "برجر لحم مع صوص خاص.",
      en: "Juicy beef burger with house sauce.",
    },
    price: 78,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-305-cheese", label: { ar: "جبنة إضافية", en: "Extra cheese" }, price: 7 },
      { id: "extra-305-fries", label: { ar: "بطاطس إضافية", en: "Extra fries" }, price: 10 },
    ],
  },
  {
    id: 306,
    name: { ar: "باستا ألفريدو", en: "Alfredo Pasta" },
    desc: {
      ar: "باستا بصلصة كريمية وفطر.",
      en: "Creamy pasta with fresh mushrooms.",
    },
    price: 72,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-306-chicken", label: { ar: "دجاج إضافي", en: "Extra chicken" }, price: 12 },
      { id: "extra-306-cheese", label: { ar: "جبنة بارميزان", en: "Parmesan cheese" }, price: 6 },
    ],
  },
  {
    id: 307,
    name: { ar: "سلطة دجاج مشوي", en: "Grilled Chicken Salad" },
    desc: {
      ar: "خضار موسمية مع دجاج مشوي.",
      en: "Seasonal greens with grilled chicken.",
    },
    price: 64,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-307-avocado", label: { ar: "أفوكادو", en: "Avocado" }, price: 8 },
      { id: "extra-307-nuts", label: { ar: "مكسرات", en: "Nuts mix" }, price: 6 },
    ],
  },
  {
    id: 308,
    name: { ar: "ساندويتش تركي", en: "Turkey Sandwich" },
    desc: {
      ar: "خبز طازج مع تركي مدخن.",
      en: "Fresh bread with smoked turkey.",
    },
    price: 58,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-308-cheese", label: { ar: "جبنة سويسرية", en: "Swiss cheese" }, price: 6 },
      { id: "extra-308-sauce", label: { ar: "صوص خاص", en: "Signature sauce" }, price: 4 },
    ],
  },
  {
    id: 309,
    name: { ar: "ستيك مشوي", en: "Grilled Steak" },
    desc: {
      ar: "ستيك طري مع صوص فلفل.",
      en: "Tender steak with pepper sauce.",
    },
    price: 120,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-309-sauce", label: { ar: "صوص فلفل", en: "Pepper sauce" }, price: 8 },
      { id: "extra-309-side", label: { ar: "طبق جانبي", en: "Side dish" }, price: 12 },
    ],
  },
  {
    id: 310,
    name: { ar: "سلمون محمر", en: "Pan-Seared Salmon" },
    desc: {
      ar: "سلمون محمر مع خضار موسمية.",
      en: "Pan-seared salmon with seasonal vegetables.",
    },
    price: 128,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-310-rice", label: { ar: "أرز بالأعشاب", en: "Herb rice" }, price: 9 },
      { id: "extra-310-sauce", label: { ar: "صوص زبدة الليمون", en: "Lemon butter" }, price: 7 },
    ],
  },
  {
    id: 311,
    name: { ar: "ريزوتو فطر", en: "Mushroom Risotto" },
    desc: {
      ar: "ريزوتو كريمي بنكهة الفطر.",
      en: "Creamy risotto with mushrooms.",
    },
    price: 92,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-311-truffle", label: { ar: "زيت ترافل", en: "Truffle oil" }, price: 14 },
      { id: "extra-311-cheese", label: { ar: "جبنة إضافية", en: "Extra cheese" }, price: 8 },
    ],
  },
  {
    id: 312,
    name: { ar: "طبق بحري", en: "Seafood Platter" },
    desc: {
      ar: "تشكيلة بحرية مع صوص الليمون.",
      en: "Seafood selection with lemon sauce.",
    },
    price: 135,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-312-shrimp", label: { ar: "روبيان إضافي", en: "Extra shrimp" }, price: 18 },
      { id: "extra-312-sauce", label: { ar: "صوص ثوم", en: "Garlic sauce" }, price: 7 },
    ],
  },
  {
    id: 313,
    name: { ar: "ليمون بالنعناع", en: "Mint Lemonade" },
    desc: {
      ar: "ليمون طازج مع نعناع وثلج.",
      en: "Fresh lemon with mint and ice.",
    },
    price: 22,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-313-mint", label: { ar: "نعناع إضافي", en: "Extra mint" }, price: 2 },
      { id: "extra-313-ice", label: { ar: "ثلج إضافي", en: "Extra ice" }, price: 1 },
    ],
  },
  {
    id: 314,
    name: { ar: "شاي مثلج بالخوخ", en: "Peach Iced Tea" },
    desc: {
      ar: "شاي مثلج بنكهة الخوخ.",
      en: "Iced tea with a peach twist.",
    },
    price: 20,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-314-lemon", label: { ar: "شرائح ليمون", en: "Lemon slices" }, price: 2 },
      { id: "extra-314-sugar", label: { ar: "سكر أقل", en: "Less sugar" }, price: 0 },
    ],
  },
  {
    id: 315,
    name: { ar: "إسبريسو", en: "Espresso" },
    desc: {
      ar: "إسبريسو مركز بحبوب محمصة.",
      en: "Bold espresso with freshly roasted beans.",
    },
    price: 18,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-315-milk", label: { ar: "حليب إضافي", en: "Extra milk" }, price: 3 },
      { id: "extra-315-vanilla", label: { ar: "نكهة فانيليا", en: "Vanilla flavor" }, price: 3 },
    ],
  },
  {
    id: 316,
    name: { ar: "كيك شوكولاتة سايح", en: "Chocolate Lava Cake" },
    desc: {
      ar: "كيك شوكولاتة دافئ بقلب سائل.",
      en: "Warm chocolate cake with a molten center.",
    },
    price: 45,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-316-icecream", label: { ar: "آيس كريم فانيليا", en: "Vanilla ice cream" }, price: 8 },
      { id: "extra-316-sauce", label: { ar: "صوص شوكولاتة", en: "Chocolate sauce" }, price: 5 },
    ],
  },
  {
    id: 317,
    name: { ar: "تشيزكيك كلاسيك", en: "Classic Cheesecake" },
    desc: {
      ar: "تشيزكيك ناعم مع صوص توت.",
      en: "Creamy cheesecake topped with berry sauce.",
    },
    price: 42,
    category: "desserts",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
    extras: [
      { id: "extra-317-berries", label: { ar: "توت إضافي", en: "Extra berries" }, price: 6 },
      { id: "extra-317-sauce", label: { ar: "صوص توت", en: "Berry sauce" }, price: 4 },
    ],
  },
];

export const menuV3Catalog: MenuCatalog = {
  categories: menuV3Categories,
  items: menuV3Items,
};
