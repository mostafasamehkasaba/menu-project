export type MenuCategory = {
  id: "all" | "apps" | "mains" | "drinks" | "desserts";
  label: string;
  icon: string;
};

export type MenuExtra = {
  id: string;
  label: string;
  price: number;
};

export type MenuItem = {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: MenuCategory["id"];
  image: string;
  tag?: "new" | "hot";
  extras?: MenuExtra[];
};

export type OfferItem = {
  id: number;
  title: string;
  desc: string;
  price: number;
  oldPrice: number;
  badge: string;
  image: string;
};

export const categories: MenuCategory[] = [
  { id: "all", label: "الكل", icon: "✦" },
  { id: "apps", label: "مقبلات", icon: "🥗" },
  { id: "mains", label: "وجبات رئيسية", icon: "🍔" },
  { id: "drinks", label: "مشروبات", icon: "🥤" },
  { id: "desserts", label: "حلويات", icon: "🍰" },
];

export const todayOffers: OfferItem[] = [
  {
    id: 1,
    title: "حلى اليوم",
    desc: "اشترِ 2 واحصل على الثالث مجانا",
    price: 130,
    oldPrice: 195,
    badge: "33%-",
    image:
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "عرض الغداء",
    desc: "وجبة رئيسية + سلطة + مشروب",
    price: 149,
    oldPrice: 200,
    badge: "25%-",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "وجبة عائلية",
    desc: "2 برجر + بيتزا كبيرة + 4 مشروبات",
    price: 399,
    oldPrice: 500,
    badge: "20%-",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80",
  },
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "حلقات البصل",
    desc: "حلقات بصل مقرمشة مع صوص الرانش",
    price: 45,
    category: "apps",
    image: "/images/Onion rings.jpg",
    extras: [
      { id: "extra-cheese", label: "جبنة إضافية", price: 15 },
      { id: "sauce", label: "صوص حار", price: 10 },
    ],
  },
  {
    id: 2,
    name: "سلطة سيزر",
    desc: "خس روماني طازج مع صوص السيزر والبارميزان",
    price: 80,
    category: "apps",
    image:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=1200&q=80",
    extras: [
      { id: "chicken", label: "دجاج مشوي", price: 30 },
      { id: "shrimp", label: "جمبري", price: 50 },
    ],
  },
  {
    id: 3,
    name: "بيتزا مارغريتا",
    desc: "بيتزا إيطالية مع صلصة الطماطم والموتزاريلا والريحان",
    price: 150,
    category: "mains",
    tag: "new",
    image: "/images/Margherita pizza.jpg",
    extras: [
      { id: "extra-cheese", label: "جبنة إضافية", price: 20 },
      { id: "mushrooms", label: "فطر", price: 15 },
    ],
  },
  {
    id: 4,
    name: "برجر لحم فاخر",
    desc: "برجر لحم بقري مع جبن الشيدر والخس والطماطم",
    price: 120,
    category: "mains",
    tag: "hot",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80",
    extras: [
      { id: "extra-patty", label: "قطعة لحم إضافية", price: 35 },
      { id: "bacon", label: "بيكون", price: 25 },
    ],
  },
  {
    id: 5,
    name: "دجاج مشوي",
    desc: "صدور دجاج مشوية مع الأرز والخضار المشكلة",
    price: 140,
    category: "mains",
    image: "/images/Grilled chicken.jpg",
  },
  {
    id: 6,
    name: "موهيتو",
    desc: "مشروب منعش بالنعناع والليمون",
    price: 40,
    category: "drinks",
    image: "/images/Mojito.jpg",
  },
  {
    id: 7,
    name: "عصير برتقال طازج",
    desc: "عصير برتقال طبيعي 100% بدون إضافات",
    price: 35,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    name: "تشيز كيك",
    desc: "تغطية فراولة طازجة",
    price: 85,
    category: "desserts",
    tag: "new",
    image: "/images/Cheesecake.jpg",
  },
  {
    id: 9,
    name: "براوني شوكولاتة",
    desc: "براوني غني بالشوكولاتة مع مكسرات",
    price: 95,
    category: "desserts",
    image: "/images/Chocolate brownie.jpg",
  },
];
