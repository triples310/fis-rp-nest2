"use client";

import { USERS } from "@/lib/data/mock-data";
import { ErpBadge, ErpButton, ErpInput, ErpSelect, ErpTableHeader, ErpTableCell, ErpCard, Row, Table, TableBody, TableHeader, TableRow } from "@/components/erp/ui";

export function SysUsers() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">使用者管理</span>
        <ErpButton>＋ 新增帳號</ErpButton>
      </div>
      <div className="flex flex-wrap gap-2 mb-3.5">
        <ErpInput placeholder="搜尋帳號/姓名…" className="w-full sm:w-[200px]" />
        <ErpSelect className="w-[120px]"><option>全部角色</option><option>Admin</option><option>業務</option><option>倉管</option><option>生產</option><option>採購</option><option>QC</option><option>財務</option></ErpSelect>
        <ErpSelect className="w-[100px]"><option>全部狀態</option><option>啟用</option><option>停用</option></ErpSelect>
      </div>
      <ErpCard>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><ErpTableHeader>帳號</ErpTableHeader><ErpTableHeader>姓名</ErpTableHeader><ErpTableHeader>角色</ErpTableHeader><ErpTableHeader>最後登入</ErpTableHeader><ErpTableHeader>狀態</ErpTableHeader><ErpTableHeader>操作</ErpTableHeader></TableRow></TableHeader>
            <TableBody>
              {USERS.map((u, i) => (
                <TableRow key={i} className="hover:bg-erp-cyan/[0.04] transition-colors">
                  <ErpTableCell mono colorClass="erp-cyan">{u.acc}</ErpTableCell>
                  <ErpTableCell>{u.name}</ErpTableCell>
                  <ErpTableCell><ErpBadge colorClass="muted-foreground" label={u.role} /></ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground" className="text-[11px]">{u.last}</ErpTableCell>
                  <ErpTableCell><ErpBadge colorClass={u.active ? "erp-green" : "erp-red"} label={u.active ? "啟用" : "停用"} /></ErpTableCell>
                  <ErpTableCell>
                    <Row className="gap-1.5">
                      <ErpButton colorClass="muted-foreground" ghost className="text-[10px] py-1 px-2.5">編輯</ErpButton>
                      <ErpButton colorClass={u.active ? "erp-red" : "erp-green"} ghost className="text-[10px] py-1 px-2.5">{u.active ? "停用" : "啟用"}</ErpButton>
                    </Row>
                  </ErpTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ErpCard>
    </div>
  );
}
