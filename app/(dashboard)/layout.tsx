

import type { ReactNode } from "react";
import { Cairo } from "next/font/google";
import DashboardShell from "./dashboard-shell";
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
      <DashboardShell>{children}</DashboardShell>
      <SaveToast />
    </div>
  );
}
