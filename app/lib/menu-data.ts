import type { LocalizedText } from "./i18n";

export type MenuCategory = {
  id: "all" | "apps" | "mains" | "drinks" | "desserts";
  label: LocalizedText;
  icon: string;
};

export type MenuExtra = {
  id: string;
  label: LocalizedText;
  price: number;
};

export type MenuItem = {
  id: number;
  name: LocalizedText;
  desc: LocalizedText;
  price: number;
  category: MenuCategory["id"];
  image: string;
  tag?: "new" | "hot";
  extras?: MenuExtra[];
};

export type OfferItem = {
  id: number;
  title: LocalizedText;
  desc: LocalizedText;
  price: number;
  oldPrice: number;
  badge: string;
  image: string;
};

export const categories: MenuCategory[] = [
  { id: "all", label: { ar: "الكل", en: "All" }, icon: "✦" },
  { id: "apps", label: { ar: "مقبلات", en: "Appetizers" }, icon: "🥗" },
  { id: "mains", label: { ar: "وجبات رئيسية", en: "Mains" }, icon: "🍔" },
  { id: "drinks", label: { ar: "مشروبات", en: "Drinks" }, icon: "🥤" },
  { id: "desserts", label: { ar: "حلويات", en: "Desserts" }, icon: "🍰" },
];

export const todayOffers: OfferItem[] = [
  {
    id: 1,
    title: { ar: "حلى اليوم", en: "Dessert of the day" },
    desc: { ar: "اشترِ 2 واحصل على الثالث مجانا", en: "Buy 2 and get the third free" },
    price: 130,
    oldPrice: 195,
    badge: "33%-",
    image:
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: { ar: "عرض الغداء", en: "Lunch offer" },
    desc: { ar: "وجبة رئيسية + سلطة + مشروب", en: "Main dish + salad + drink" },
    price: 149,
    oldPrice: 200,
    badge: "25%-",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: { ar: "وجبة عائلية", en: "Family meal" },
    desc: { ar: "2 برجر + بيتزا كبيرة + 4 مشروبات", en: "2 burgers + large pizza + 4 drinks" },
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
    name: { ar: "حلقات البصل", en: "Onion rings" },
    desc: { ar: "حلقات بصل مقرمشة مع صوص الرانش", en: "Crispy onion rings with ranch sauce" },
    price: 45,
    category: "apps",
    image: "/images/Onion rings.jpg",
    extras: [
      { id: "extra-cheese", label: { ar: "جبنة إضافية", en: "Extra cheese" }, price: 15 },
      { id: "sauce", label: { ar: "صوص حار", en: "Spicy sauce" }, price: 10 },
    ],
  },
  {
    id: 2,
    name: { ar: "سلطة سيزر", en: "Caesar salad" },
    desc: { ar: "خس روماني طازج مع صوص السيزر والبارميزان", en: "Fresh romaine with Caesar dressing and parmesan" },
    price: 80,
    category: "apps",
    image:
      "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=1200&q=80",
    extras: [
      { id: "chicken", label: { ar: "دجاج مشوي", en: "Grilled chicken" }, price: 30 },
      { id: "shrimp", label: { ar: "جمبري", en: "Shrimp" }, price: 50 },
    ],
  },
  {
    id: 3,
    name: { ar: "بيتزا مارغريتا", en: "Margherita pizza" },
    desc: { ar: "بيتزا إيطالية مع صلصة الطماطم والموتزاريلا والريحان", en: "Italian pizza with tomato sauce, mozzarella, and basil" },
    price: 150,
    category: "mains",
    tag: "new",
    image: "/images/Margherita pizza.jpg",
    extras: [
      { id: "extra-cheese", label: { ar: "جبنة إضافية", en: "Extra cheese" }, price: 20 },
      { id: "mushrooms", label: { ar: "فطر", en: "Mushrooms" }, price: 15 },
    ],
  },
  {
    id: 4,
    name: { ar: "برجر لحم فاخر", en: "Premium beef burger" },
    desc: { ar: "برجر لحم بقري مع جبن الشيدر والخس والطماطم", en: "Beef burger with cheddar, lettuce, and tomato" },
    price: 120,
    category: "mains",
    tag: "hot",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80",
    extras: [
      { id: "extra-patty", label: { ar: "قطعة لحم إضافية", en: "Extra patty" }, price: 35 },
      { id: "bacon", label: { ar: "بيكون", en: "Bacon" }, price: 25 },
    ],
  },
  {
    id: 10,
    name: { ar: "وجبة عائلية", en: "Family meal" },
    desc: { ar: "2 برجر + بيتزا كبيرة + 4 مشروبات", en: "2 burgers + large pizza + 4 drinks" },
    price: 399,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 5,
    name: { ar: "دجاج مشوي", en: "Grilled chicken" },
    desc: { ar: "صدور دجاج مشوية مع الأرز والخضار المشكلة", en: "Grilled chicken breast with rice and mixed vegetables" },
    price: 140,
    category: "mains",
    image: "/images/Grilled chicken.jpg",
  },
  {
    id: 6,
    name: { ar: "موهيتو", en: "Mojito" },
    desc: { ar: "مشروب منعش بالنعناع والليمون", en: "Refreshing drink with mint and lemon" },
    price: 40,
    category: "drinks",
    image: "/images/Mojito.jpg",
  },
  {
    id: 7,
    name: { ar: "عصير برتقال طازج", en: "Fresh orange juice" },
    desc: { ar: "عصير برتقال طبيعي 100% بدون إضافات", en: "100% natural orange juice, no additives" },
    price: 35,
    category: "drinks",
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    name: { ar: "تشيز كيك", en: "Cheesecake" },
    desc: { ar: "تغطية فراولة طازجة", en: "Fresh strawberry topping" },
    price: 85,
    category: "desserts",
    tag: "new",
    image: "/images/Cheesecake.jpg",
  },
  {
    id: 9,
    name: { ar: "براوني شوكولاتة", en: "Chocolate brownie" },
    desc: { ar: "براوني غني بالشوكولاتة مع مكسرات", en: "Rich chocolate brownie with nuts" },
    price: 95,
    category: "desserts",
    image: "/images/Chocolate brownie.jpg",
  },
];
