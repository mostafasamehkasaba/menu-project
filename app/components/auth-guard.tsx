"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasAccessToken } from "../services/api-client";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const redirectToLogin = useCallback(() => {
    const nextPath =
      pathname && pathname !== "/login" ? pathname : "/dashboard";
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }, [pathname, router]);

  useEffect(() => {
    if (hasAccessToken()) {
      setReady(true);
      return;
    }
    redirectToLogin();
  }, [redirectToLogin]);

  useEffect(() => {
    const handleExpired = () => {
      setReady(false);
      redirectToLogin();
    };
    window.addEventListener("app:auth-expired", handleExpired);
    return () => window.removeEventListener("app:auth-expired", handleExpired);
  }, [redirectToLogin]);

  if (!ready) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-right text-sm text-slate-500">
        جاري التحقق من تسجيل الدخول...
      </div>
    );
  }

  return <>{children}</>;
}

