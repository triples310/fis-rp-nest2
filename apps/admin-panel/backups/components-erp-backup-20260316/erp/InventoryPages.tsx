"use client";

import { useState } from "react";
import { BATCHES } from "@/lib/data/mock-data";
import { ErpBadge, ErpButton, ErpInput, ErpSelect, ErpTableHeader, ErpTableCell, ErpCard, Row, STitle, Table, TableBody, TableHeader, TableRow } from "@/components/erp/ui";

export function InvBatch() {
  const [search, setSearch] = useState("");
  const list = BATCHES.filter((b) => b.sku.includes(search) || b.batch.includes(search) || b.loc.includes(search));
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">批號庫存查詢</span>
        <ErpButton colorClass="erp-purple" ghost>匯出報表</ErpButton>
      </div>
      <div className="flex flex-wrap gap-2 mb-3.5">
        <ErpInput placeholder="搜尋 SKU / 批號 / 倉位" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-[260px]" />
        <ErpSelect className="w-[130px]"><option>全部倉庫</option><option>冷鏈倉 A</option><option>冷鏈倉 B</option><option>內倉 C</option><option>內倉 D</option></ErpSelect>
        <ErpSelect className="w-[130px]"><option>全部效期狀態</option><option>緊急即期(≤7天)</option><option>即期品(≤30天)</option><option>正常</option></ErpSelect>
      </div>
      <ErpCard>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><ErpTableHeader>批號</ErpTableHeader><ErpTableHeader>商品</ErpTableHeader><ErpTableHeader>效期</ErpTableHeader><ErpTableHeader>入庫日</ErpTableHeader><ErpTableHeader>倉位</ErpTableHeader><ErpTableHeader>總量</ErpTableHeader><ErpTableHeader>鎖定</ErpTableHeader><ErpTableHeader>可用</ErpTableHeader><ErpTableHeader>狀態</ErpTableHeader></TableRow></TableHeader>
            <TableBody>
              {list.map((b) => (
                <TableRow key={b.batch} className="hover:bg-erp-purple/[0.04] transition-colors">
                  <ErpTableCell mono colorClass="erp-cyan">{b.batch}</ErpTableCell>
                  <ErpTableCell>{b.sku}</ErpTableCell>
                  <ErpTableCell colorClass={b.days <= 7 ? "erp-red" : b.days <= 30 ? "erp-yellow" : "muted-foreground"}>{b.expiry}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{b.inbound}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{b.loc}</ErpTableCell>
                  <ErpTableCell>{b.qty}</ErpTableCell>
                  <ErpTableCell colorClass="erp-orange">{b.rsv || "—"}</ErpTableCell>
                  <ErpTableCell bold colorClass="erp-green">{b.qty - b.rsv}</ErpTableCell>
                  <ErpTableCell>
                    <ErpBadge
                      colorClass={b.days <= 0 ? "erp-red" : b.days <= 7 ? "erp-red" : b.days <= 30 ? "erp-yellow" : "erp-green"}
                      label={b.days <= 0 ? "已過期" : b.days <= 7 ? "緊急即期" : b.days <= 30 ? "即期品" : "正常"}
                    />
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

export function InvTrace() {
  const [traced, setTraced] = useState(false);
  return (
    <div>
      <div className="text-[13px] font-bold text-foreground mb-4">全鏈路溯源查詢</div>
      <ErpCard className="mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <ErpInput placeholder="輸入批號 / 訂單編號 / 原料 SKU…" className="flex-1" />
          <ErpSelect className="w-full sm:w-[140px]"><option>正向追蹤（原→成）</option><option>逆向追蹤（成→原）</option></ErpSelect>
          <ErpButton colorClass="erp-purple" onClick={() => setTraced(true)}>🔍 追蹤</ErpButton>
        </div>
      </ErpCard>
      {traced && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErpCard>
            <STitle>溯源路徑</STitle>
            {[
              { icon: "📋", label: "採購入庫", detail: "PO-2026-0102 · 龍騰水產 · 2026-02-25", colorClass: "erp-yellow", sub: "批號 260101-003 · 500kg 鱘魚原料" },
              { icon: "🔍", label: "QC 驗收", detail: "允收 ✓ · 張主任 · 2026-03-01", colorClass: "erp-cyan", sub: "實收 500kg，無異常" },
              { icon: "📥", label: "原料入庫", detail: "批號 260101-003 · 冷鏈D-01", colorClass: "erp-blue", sub: "效期 2026-03-08" },
              { icon: "⚙️", label: "生產投料", detail: "WO-2026-0201 · 投料 80g × 100批", colorClass: "erp-orange", sub: "生產人員：王志強 · 2026-03-02" },
              { icon: "✅", label: "成品入庫", detail: "批號 260304-003 · 魚子醬50g × 100件", colorClass: "erp-green", sub: "繼承效期 → 2026-03-08" },
              { icon: "📤", label: "銷售出庫", detail: "SO-2026-0302 · 全聯福利中心", colorClass: "erp-blue", sub: "數量 15件 · 2026-03-03" },
            ].map((s, i, arr) => {
              const bgMap: Record<string, string> = {
                "erp-yellow": "bg-erp-yellow/5 border-erp-yellow/15",
                "erp-cyan": "bg-erp-cyan/5 border-erp-cyan/15",
                "erp-blue": "bg-erp-blue/5 border-erp-blue/15",
                "erp-orange": "bg-erp-orange/5 border-erp-orange/15",
                "erp-green": "bg-erp-green/5 border-erp-green/15",
              };
              const textMap: Record<string, string> = {
                "erp-yellow": "text-erp-yellow",
                "erp-cyan": "text-erp-cyan",
                "erp-blue": "text-erp-blue",
                "erp-orange": "text-erp-orange",
                "erp-green": "text-erp-green",
              };
              const lineMap: Record<string, string> = {
                "erp-yellow": "bg-erp-yellow/20",
                "erp-cyan": "bg-erp-cyan/20",
                "erp-blue": "bg-erp-blue/20",
                "erp-orange": "bg-erp-orange/20",
                "erp-green": "bg-erp-green/20",
              };
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center w-6">
                    <div className="text-lg">{s.icon}</div>
                    {i < arr.length - 1 && <div className={`w-px h-6 my-0.5 ${lineMap[s.colorClass] || "bg-border"}`} />}
                  </div>
                  <div className={`flex-1 p-3 rounded-md mb-1 border ${bgMap[s.colorClass] || ""}`}>
                    <div className={`text-xs font-bold ${textMap[s.colorClass] || ""}`}>{s.label}</div>
                    <div className="text-[11px] text-foreground mt-0.5">{s.detail}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </ErpCard>
          <ErpCard>
            <STitle>關聯單據</STitle>
            {[
              { type: "採購單", id: "PO-2026-0102", colorClass: "erp-yellow" },
              { type: "工單", id: "WO-2026-0201", colorClass: "erp-red" },
              { type: "訂單", id: "SO-2026-0302", colorClass: "erp-blue" },
              { type: "AP", id: "INV-A0225", colorClass: "erp-finance" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 bg-background rounded-md mb-2 border border-border">
                <ErpBadge colorClass={r.colorClass} label={r.type} />
                <span className="font-mono text-xs text-foreground flex-1">{r.id}</span>
                <ErpButton colorClass={r.colorClass} ghost className="text-[10px] py-1 px-2.5">查看</ErpButton>
              </div>
            ))}
          </ErpCard>
        </div>
      )}
    </div>
  );
}

export function InvExpiry() {
  const b = BATCHES.filter((x) => x.days <= 30).sort((a, c) => a.days - c.days);
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">效期管理</span>
        <ErpBadge colorClass="erp-red" label={`${b.length} 批需注意`} />
      </div>
      <ErpCard>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><ErpTableHeader>批號</ErpTableHeader><ErpTableHeader>商品</ErpTableHeader><ErpTableHeader>倉位</ErpTableHeader><ErpTableHeader>剩餘天數</ErpTableHeader><ErpTableHeader>可用量</ErpTableHeader><ErpTableHeader>效期</ErpTableHeader></TableRow></TableHeader>
            <TableBody>
              {b.map((x, i) => (
                <TableRow key={i}>
                  <ErpTableCell mono colorClass="erp-cyan">{x.batch}</ErpTableCell>
                  <ErpTableCell>{x.sku}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{x.loc}</ErpTableCell>
                  <ErpTableCell>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      x.days <= 3 ? "bg-erp-red/20 text-erp-red" : "bg-erp-yellow/15 text-erp-yellow"
                    }`}>{x.days}天</span>
                  </ErpTableCell>
                  <ErpTableCell bold colorClass="erp-green">{x.qty - x.rsv}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{x.expiry}</ErpTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ErpCard>
    </div>
  );
}
