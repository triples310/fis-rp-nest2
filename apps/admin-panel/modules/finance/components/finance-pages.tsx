"use client";

import { AP, VENDORS } from "@/lib/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHeader as ShadTableHeader, TableRow } from "@/components/ui/table";
import { ErpCard } from "@/components/erp-card";
import { ErpKpiCard } from "@/components/erp-kpi-card";
import { Row, STitle } from "@/components/layout";
import { ErpSelect } from "@/components/forms";
import { ErpTableHeader, ErpTableCell } from "@/components/data-display";

export function FinAP() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">應付帳款 (AP)</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">
            待付款合計：<span className="text-erp-orange font-bold">NT$213,500</span>
          </span>
          <Button variant="muted-foreground-ghost">匯出帳款表</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-3.5">
        <ErpSelect className="w-[120px]"><option>全部狀態</option><option>待付款</option><option>核對中</option><option>已付款</option><option>逾期</option></ErpSelect>
        <ErpSelect className="w-[140px]"><option>全部供應商</option>{VENDORS.map((v) => <option key={v.name}>{v.name}</option>)}</ErpSelect>
      </div>
      <ErpCard>
        <div className="overflow-x-auto">
          <Table>
            <ShadTableHeader><TableRow><ErpTableHeader>發票號</ErpTableHeader><ErpTableHeader>供應商</ErpTableHeader><ErpTableHeader>關聯 PO</ErpTableHeader><ErpTableHeader>金額</ErpTableHeader><ErpTableHeader>付款到期</ErpTableHeader><ErpTableHeader>狀態</ErpTableHeader><ErpTableHeader>操作</ErpTableHeader></TableRow></ShadTableHeader>
            <TableBody>
              {AP.map((r, i) => (
                <TableRow key={i} className="hover:bg-erp-blue/[0.04] transition-colors">
                  <ErpTableCell mono colorClass="erp-finance">{r.inv}</ErpTableCell>
                  <ErpTableCell>{r.vendor}</ErpTableCell>
                  <ErpTableCell mono colorClass="muted-foreground" className="text-[10px]">{r.po}</ErpTableCell>
                  <ErpTableCell bold>NT${r.amount.toLocaleString()}</ErpTableCell>
                  <ErpTableCell colorClass={r.status === "逾期" ? "erp-red" : r.status !== "已付款" ? "erp-yellow" : "muted-foreground"}>{r.due}</ErpTableCell>
                  <ErpTableCell><Badge variant={r.status === "已付款" ? "erp-green" : r.status === "核對中" ? "erp-yellow" : r.status === "逾期" ? "erp-red" : "erp-orange" as any}>{r.status}</Badge></ErpTableCell>
                  <ErpTableCell>
                    <Row className="gap-1.5">
                      {r.status === "待付款" && <Button variant="erp-finance">核對發票</Button>}
                      {r.status === "核對中" && <Button variant="erp-green">確認付款</Button>}
                      {r.status === "逾期" && <Button variant="erp-red">緊急付款</Button>}
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

export function FinPL() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">損益分析</span>
        <div className="flex items-center gap-2">
          <ErpSelect className="w-[140px]"><option>2026年3月（當月）</option><option>2026年2月</option><option>2026年1月</option><option>2025年Q4</option></ErpSelect>
          <Button variant="erp-finance">🔄 手動觸發即時同步</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        <ErpKpiCard label="銷售收入" value="NT$368K" sub="+8% MoM" colorClass="erp-green" icon="💵" />
        <ErpKpiCard label="銷貨成本" value="NT$241K" sub="COGS" colorClass="erp-orange" icon="📦" />
        <ErpKpiCard label="毛利" value="NT$127K" sub="毛利率 34.5%" colorClass="erp-cyan" icon="💰" />
        <ErpKpiCard label="報廢損耗" value="NT$13.2K" sub="較上月 -30%" colorClass="erp-red" icon="🗑" />
        <ErpKpiCard label="淨利" value="NT$102K" sub="淨利率 27.7%" colorClass="erp-finance" icon="📈" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ErpCard>
          <STitle>損益明細</STitle>
          {[
            { label: "銷售收入", val: "+NT$368,000", colorClass: "erp-green", indent: 0, bold: false },
            { label: "└ B2B 銷售", val: "NT$320,000", colorClass: "muted-foreground", indent: 1, bold: false },
            { label: "└ B2C 銷售", val: "NT$48,000", colorClass: "muted-foreground", indent: 1, bold: false },
            { label: "銷貨成本(COGS)", val: "-NT$241,000", colorClass: "erp-red", indent: 0, bold: false },
            { label: "毛利", val: "NT$127,000", colorClass: "erp-green", indent: 0, bold: true },
            { label: "倉儲費用", val: "-NT$18,000", colorClass: "erp-orange", indent: 0, bold: false },
            { label: "加工/人工", val: "-NT$5,200", colorClass: "erp-orange", indent: 0, bold: false },
            { label: "報廢損耗", val: "-NT$6,800", colorClass: "erp-red", indent: 0, bold: false },
            { label: "其他費用", val: "-NT$800", colorClass: "muted-foreground", indent: 0, bold: false },
            { label: "淨利", val: "NT$102,200", colorClass: "erp-cyan", indent: 0, bold: true },
          ].map((r, i) => {
            const textMap: Record<string, string> = {
              "erp-green": "text-erp-green",
              "erp-red": "text-erp-red",
              "erp-orange": "text-erp-orange",
              "erp-cyan": "text-erp-cyan",
              "muted-foreground": "text-muted-foreground",
            };
            const valCls = textMap[r.colorClass] || "text-foreground";
            return (
              <Row key={i} className="justify-between py-2 border-b border-border" style={{ paddingLeft: r.indent * 16 }}>
                <span className={r.bold ? "text-[13px] text-foreground" : "text-xs text-muted-foreground"}>{r.label}</span>
                <span className={`${r.bold ? "text-base" : "text-[13px]"} font-bold ${valCls}`}>{r.val}</span>
              </Row>
            );
          })}
        </ErpCard>
        <ErpCard>
          <STitle>品項毛利排行</STitle>
          <div className="overflow-x-auto">
            <Table>
              <ShadTableHeader><TableRow><ErpTableHeader>商品</ErpTableHeader><ErpTableHeader>銷量</ErpTableHeader><ErpTableHeader>毛利/件</ErpTableHeader><ErpTableHeader>毛利率</ErpTableHeader></TableRow></ShadTableHeader>
              <TableBody>
                {[
                  { sku: "魚子醬禮盒 3入", sold: 35, margin: 1180, rate: 42.1 },
                  { sku: "魚子醬 50g", sold: 80, margin: 360, rate: 40.9 },
                  { sku: "鱘魚片 500g", sold: 150, margin: 110, rate: 34.4 },
                  { sku: "鱘魚卵鹽漬", sold: 40, margin: 230, rate: 35.4 },
                  { sku: "煙燻鱘魚 200g", sold: 60, margin: 100, rate: 26.3 },
                  { sku: "海鮮精選套組", sold: 12, margin: 1800, rate: 42.9 },
                ].sort((a, b) => b.rate - a.rate).map((r, i) => (
                  <TableRow key={i}>
                    <ErpTableCell>{r.sku}</ErpTableCell>
                    <ErpTableCell colorClass="muted-foreground">{r.sold}</ErpTableCell>
                    <ErpTableCell bold colorClass="erp-green">NT${r.margin}</ErpTableCell>
                    <ErpTableCell>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        r.rate >= 40 ? "bg-erp-green/15 text-erp-green" :
                        r.rate >= 30 ? "bg-erp-yellow/15 text-erp-yellow" :
                        "bg-erp-orange/15 text-erp-orange"
                      }`}>{r.rate}%</span>
                    </ErpTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ErpCard>
      </div>
    </div>
  );
}
