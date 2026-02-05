

import type { ReactNode } from "react";
import { Cairo } from "next/font/google";
import DashboardNavbar from "../components/dashboard-navbar";
import DashboardSidebar from "../components/dashboard-sidebar";
import SaveToast from "../components/save-toast";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${cairo.className} min-h-screen bg-slate-50 text-slate-900`}
    >
      <div className="grid min-h-screen w-full gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[280px_1fr] lg:px-10">
        <main className="space-y-6 lg:order-2">
          <DashboardNavbar />
          {children}
        </main>
        <DashboardSidebar />
      </div>
      <SaveToast />
    </div>
  );
}
