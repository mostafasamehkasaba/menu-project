"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AuthGuard from "../components/auth-guard";
import DashboardNavbar from "../components/dashboard-navbar";
import DashboardSidebar from "../components/dashboard-sidebar";

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isSidebarOpen]);

  return (
    <div className="grid min-h-screen w-full gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[280px_1fr] lg:px-10">
      <AuthGuard>
        <main className="space-y-6 lg:order-2">
          <DashboardNavbar showSidebarToggle onToggleSidebar={openSidebar} />
          {children}
        </main>

        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {isSidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              onClick={closeSidebar}
              className="absolute inset-0 bg-slate-900/40"
              aria-label="إغلاق القائمة"
            />
            <div className="absolute inset-y-4 right-4 w-[90vw] max-w-sm">
              <DashboardSidebar
                className="h-full overflow-y-auto"
                showClose
                onClose={closeSidebar}
              />
            </div>
          </div>
        ) : null}
      </AuthGuard>
    </div>
  );
}
