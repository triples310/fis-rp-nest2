"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU, pathToMenuItem, flatSub } from "@/lib/data/menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Menu, LogOut } from "lucide-react";

interface UserFooterSectionProps {
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
}

function UserFooterSection({ user, onLogout }: UserFooterSectionProps) {
  return (
    <div className="px-3 py-3 border-t border-sidebar-border flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 bg-primary/10 text-primary">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-sidebar-foreground truncate">
            {user?.name || "使用者"}
          </div>
          <div className="text-[10px] text-muted-foreground">{user?.role || ""}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onLogout}
          title="登出"
        >
          <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

interface SidebarNavProps {
  onNavigate?: () => void;
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
}

function SidebarNav({ onNavigate, user, onLogout }: SidebarNavProps) {
  const pathname = usePathname();
  const activePageId = pathToMenuItem[pathname] || "dash_overview";
  const activeParent = flatSub[activePageId]?.parentId;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    MENU.forEach((m) => {
      o[m.id] = m.id === (flatSub[activePageId]?.parentId || "dashboard");
    });
    return o;
  });

  // 當路由變化時，確保對應的父級選單是展開的
  useEffect(() => {
    if (activeParent) {
      setOpenGroups((prev) => ({ ...prev, [activeParent]: true }));
    }
  }, [activeParent]);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0 text-primary-foreground bg-primary">
            鱘
          </div>
          <div>
            <div className="text-sm font-semibold text-sidebar-foreground">鱘寶 ERP</div>
            <div className="text-[10px] text-muted-foreground">SCM · Finance</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-2">
        <div className="px-2 space-y-0.5">
          {MENU.map((m) => {
            const isActiveParent = m.id === activeParent;
            const Icon = m.icon;

            return (
              <Collapsible
                key={m.id}
                open={openGroups[m.id]}
                onOpenChange={(open) => setOpenGroups((p) => ({ ...p, [m.id]: open }))}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 w-full text-left cursor-pointer rounded-md transition-colors text-sm",
                      isActiveParent
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{m.label}</span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        openGroups[m.id] && "rotate-90"
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="ml-3 pl-3 border-l border-border space-y-0.5 mt-0.5 mb-1">
                    {m.sub.map((s) => {
                      const isActive = pathname === s.path;
                      const SubIcon = s.icon;
                      return (
                        <Link
                          key={s.id}
                          href={s.path}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center gap-2 py-1.5 px-2.5 w-full text-left cursor-pointer rounded-md transition-colors text-[13px]",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <SubIcon className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{s.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>

      {/* User */}
      <UserFooterSection user={user} onLogout={onLogout} />
    </div>
  );
}

// Desktop sidebar
interface ErpSidebarProps {
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
}

function DesktopSidebar(props: ErpSidebarProps) {
  return (
    <aside className="hidden md:flex w-56 bg-sidebar border-r border-sidebar-border flex-col flex-shrink-0 overflow-hidden">
      <SidebarNav {...props} />
    </aside>
  );
}

// Mobile sidebar (Sheet)
function MobileSidebar(props: ErpSidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-56 bg-sidebar">
        <SidebarNav {...props} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default function ErpSidebar(props: ErpSidebarProps) {
  return <DesktopSidebar {...props} />;
}

export { MobileSidebar };
