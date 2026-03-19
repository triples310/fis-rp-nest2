"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, X, Plus } from "lucide-react";
import { RoleDialog } from "./role-dialog";

const MOCK_ROLES = [
  { id: 1, name: "一般使用者", note: "--" },
  { id: 2, name: "系統管理者", note: "--" },
];

const PERM_MODULES = [
  { group: "商品管理", items: ["商品", "商品品牌", "商品分類"] },
  { group: "訂單管理", items: ["訂單"] },
  { group: "採購管理", items: ["採購單", "進貨驗收", "供應商"] },
  { group: "倉儲作業", items: ["入庫", "出庫", "調撥"] },
  { group: "生產管理", items: ["投料", "加工分色", "成品報工"] },
  { group: "庫存管理", items: ["批號查詢", "效期管理", "庫存調整"] },
  { group: "財務管理", items: ["應付帳款", "損益分析"] },
];

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="搜尋..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-9 bg-card border-border focus-visible:ring-primary/30"
      />
    </div>
  );
}

export function RoleList() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", accounts: [] as string[], note: "" });
  const [perms, setPerms] = useState<Record<string, { edit: boolean; view: boolean }>>({});

  const filtered = MOCK_ROLES.filter((r) => !search || r.name.includes(search));

  function resetForm() {
    setForm({ name: "", accounts: [], note: "" });
    const p: Record<string, { edit: boolean; view: boolean }> = {};
    PERM_MODULES.forEach((m) => m.items.forEach((item) => { p[item] = { edit: false, view: false }; }));
    setPerms(p);
  }

  function togglePerm(item: string, type: "edit" | "view") {
    setPerms((prev) => ({ ...prev, [item]: { ...prev[item], [type]: !prev[item]?.[type] } }));
  }

  function toggleGroupHeader(group: string, type: "edit" | "view") {
    const mod = PERM_MODULES.find((m) => m.group === group);
    if (!mod) return;
    const allChecked = mod.items.every((item) => perms[item]?.[type]);
    const newPerms = { ...perms };
    mod.items.forEach((item) => {
      if (!newPerms[item]) newPerms[item] = { edit: false, view: false };
      newPerms[item][type] = !allChecked;
    });
    setPerms(newPerms);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <SearchBar value={search} onChange={setSearch} />
        <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="gap-1.5 shrink-0 shadow-sm">
          <Plus className="h-4 w-4" />
          新增
        </Button>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[80px] text-center font-semibold text-xs tracking-wider">項次</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider">名稱</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider">備註</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">無符合條件的資料</TableCell>
              </TableRow>
            ) : (
              filtered.map((r, i) => (
                <TableRow key={r.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="text-center text-muted-foreground tabular-nums">{i + 1}</TableCell>
                  <TableCell className="text-center font-medium">{r.name}</TableCell>
                  <TableCell className="text-center text-muted-foreground text-xs">{r.note}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <RoleDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        form={form}
        onFormChange={setForm}
        perms={perms}
        onTogglePerm={togglePerm}
        onToggleGroupHeader={toggleGroupHeader}
      />
    </div>
  );
}
