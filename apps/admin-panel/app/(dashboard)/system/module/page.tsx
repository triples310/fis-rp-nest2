"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_MODULES = [
  { id: 1, sorting: 0, name: "首頁", version: "v1.0", note: "首頁", enabled: true },
  { id: 2, sorting: 100, name: "商品模組", version: "v1.6", note: "管理商品", enabled: true },
  { id: 3, sorting: 150, name: "進貨模組", version: "v1.3", note: "管理進貨", enabled: false },
  { id: 4, sorting: 200, name: "會員模組", version: "v1.6", note: "管理會員", enabled: true },
  { id: 5, sorting: 300, name: "訂單模組", version: "v1.4", note: "管理訂單", enabled: true },
  { id: 6, sorting: 400, name: "雜項模組", version: "v1.0", note: "管理雜項", enabled: false },
  { id: 7, sorting: 900, name: "帳號模組", version: "v1.2", note: "讓系統變成需要帳號登入", enabled: true },
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

export default function ModulePage() {
  const [search, setSearch] = useState("");
  const [modules, setModules] = useState(MOCK_MODULES);

  const filtered = modules.filter((m) => !search || m.name.includes(search) || m.note.includes(search));

  function toggleModule(id: number) {
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m));
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">模組設定</h1>
        <p className="text-xs text-muted-foreground mt-1">資料庫版本: 2019_12_13_140000_modify_user</p>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <Card className="border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[70px] text-center font-semibold text-xs tracking-wider">項次</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider w-[100px]">Sorting</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider">名稱</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider">版本</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider">備註</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider w-[100px]">狀態</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">無符合條件的資料</TableCell>
              </TableRow>
            ) : (
              filtered.map((m, i) => (
                <TableRow key={m.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="text-center text-muted-foreground tabular-nums">{i + 1}</TableCell>
                  <TableCell className="text-center tabular-nums text-muted-foreground">{m.sorting}</TableCell>
                  <TableCell className="text-center font-medium">{m.name}</TableCell>
                  <TableCell className="text-center text-muted-foreground font-mono text-xs">{m.version}</TableCell>
                  <TableCell className="text-center text-muted-foreground text-xs">{m.note}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] font-semibold border",
                        m.enabled
                          ? "bg-erp-green/15 text-erp-green border-erp-green/30"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {m.enabled ? "已啟用" : "未啟用"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant={m.enabled ? "outline" : "default"}
                      className={cn(
                        "text-xs h-8 min-w-[60px] shadow-sm",
                        !m.enabled && "bg-primary hover:bg-primary/90"
                      )}
                      onClick={() => toggleModule(m.id)}
                    >
                      {m.enabled ? "停用" : "啟用"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
