"use client";

import { useState } from "react";
import { USERS } from "@/lib/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, X, Plus } from "lucide-react";
import { AccountDialog } from "./account-dialog";

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

export function AccountList() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", account: "", password: "", email: "", role: "", note: "" });

  const filtered = USERS.filter(
    (u) => !search || u.name.includes(search) || u.acc.includes(search)
  );

  function resetForm() {
    setForm({ name: "", account: "", password: "", email: "", role: "", note: "" });
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
              <TableHead className="text-center font-semibold text-xs tracking-wider">角色</TableHead>
              <TableHead className="text-center font-semibold text-xs tracking-wider">備註</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">無符合條件的資料</TableCell>
              </TableRow>
            ) : (
              filtered.map((u, i) => (
                <TableRow key={i} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="text-center text-muted-foreground tabular-nums">{i + 1}</TableCell>
                  <TableCell className="text-center font-medium">{u.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {u.role === "Admin" ? "系統管理者" : "一般使用者"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground text-xs">--</TableCell>
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

      <AccountDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        form={form}
        onFormChange={setForm}
      />
    </div>
  );
}
