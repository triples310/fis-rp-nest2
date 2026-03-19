"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { pathToMenuItem, flatSub } from "@/lib/data/menu";
import { BATCHES } from "@/lib/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Sun, Moon } from "lucide-react";
import { MobileSidebar } from "./sidebar";

interface TopbarProps {
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
}

export function Topbar({ user, onLogout }: TopbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const activePageId = pathToMenuItem[pathname] || "dash_overview";
  const meta = flatSub[activePageId] || {
    label: "",
    parentLabel: "",
    icon: Sun,
  };

  const urgentCount = BATCHES.filter((b) => b.days <= 7).length;

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-12 border-b border-border bg-card flex-shrink-0 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <MobileSidebar user={user} onLogout={onLogout} />
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {meta.parentLabel}
        </span>
        <ChevronRight className="h-3 w-3 text-muted-foreground hidden sm:inline" />
        <span className="text-sm font-medium text-foreground truncate">
          {meta.label}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 px-2.5 gap-1.5"
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline text-xs">
            {theme === "dark" ? "淺色" : "深色"}
          </span>
        </Button>
        <div className="hidden sm:flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[11px] bg-erp-green/10 text-erp-green border-erp-green/30"
          >
            ● 系統正常
          </Badge>
          {urgentCount > 0 && (
            <Badge
              variant="outline"
              className="text-[11px] bg-destructive/10 text-destructive border-destructive/30"
            >
              ⚠ {urgentCount} 批緊急即期
            </Badge>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground hidden lg:inline font-mono">
          2026-03-10
        </span>
      </div>
    </header>
  );
}
