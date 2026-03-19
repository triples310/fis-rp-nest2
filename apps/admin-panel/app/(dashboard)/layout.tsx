"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import ErpSidebar from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user, logout } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-2xl font-bold bg-primary text-primary-foreground mb-4">
            鱘
          </div>
          <p className="text-sm text-muted-foreground">驗證中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground text-sm">
      <ErpSidebar user={user} onLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar user={user} onLogout={logout} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
