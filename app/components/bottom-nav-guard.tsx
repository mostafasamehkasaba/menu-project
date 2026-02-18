"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./bottom-nav";

export default function BottomNavGuard() {
  const pathname = usePathname();

  const adminRoutes = [
    "/login",
    "/dashboard",
    "/products",
    "/categories",
    "/offers",
    "/tables",
    "/orders",
    "/calls",
    "/reservations",
    "/payments",
    "/users",
    "/settings",
    "/qr",
  ];

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return <BottomNav />;
}
