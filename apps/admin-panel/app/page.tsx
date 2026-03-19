"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) return;
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-2xl font-bold bg-primary text-primary-foreground mb-4">
          鱘
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">鱘寶 ERP</h1>
        <p className="text-sm text-muted-foreground">載入中...</p>
      </div>
    </div>
  );
}
