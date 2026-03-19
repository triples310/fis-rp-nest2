"use client";

import { BATCHES, TXNS, TXN_COLOR } from "@/lib/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErpCard } from "@/components/erp-card";
import { ErpKpiCard } from "@/components/erp-kpi-card";
import { Row, STitle } from "@/components/layout";
import { ErpSelect } from "@/components/forms";
import { ErpTableHeader, ErpTableCell } from "@/components/data-display";
import { Table, TableBody, TableHeader as ShadTableHeader, TableRow } from "@/components/ui/table";

export function DashOverview() {
  const expiring = BATCHES.filter((b) => b.days <= 30);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        <ErpKpiCard label="今日入庫批次" value="14" sub="↑5 較昨日" colorClass="erp-cyan" icon="📥" />
        <ErpKpiCard label="今日出庫筆數" value="32" sub="總量 1,480件" colorClass="erp-blue" icon="📤" />
        <ErpKpiCard label="效期預警批號" value={`${expiring.length}`} sub="≤30天到期" colorClass="erp-red" icon="⚠️" />
        <ErpKpiCard label="本月毛利" value="NT$284K" sub="↑12% 較上月" colorClass="erp-green" icon="💰" />
        <ErpKpiCard label="待處理訂單" value="7" sub="備貨中 3 筆" colorClass="erp-yellow" icon="📋" />
        <ErpKpiCard label="在途採購單" value="3" sub="金額 157.5K" colorClass="erp-orange" icon="🚚" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ErpCard>
          <STitle>倉庫容量即時狀態</STitle>
          {[
            { name: "冷鏈倉 A", used: 72, cap: 100, temp: "-18°C", unit: "噸" },
            { name: "冷鏈倉 B", used: 53, cap: 80, temp: "-5°C", unit: "噸" },
            { name: "內倉 C", used: 218, cap: 300, temp: "常溫", unit: "箱" },
            { name: "內倉 D", used: 62, cap: 150, temp: "常溫", unit: "箱" },
          ].map((w) => {
            const pct = Math.round((w.used / w.cap) * 100);
            const ratio = w.used / w.cap;
            const barCls = ratio > 0.85 ? "bg-erp-red" : ratio > 0.65 ? "bg-erp-yellow" : "bg-erp-cyan";
            return (
              <div key={w.name} className="mb-3">
                <Row className="justify-between mb-1.5">
                  <span className="text-xs text-foreground">{w.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {w.temp} · {w.used}/{w.cap} {w.unit} ({pct}%)
                  </span>
                </Row>
                <div className="h-1.5 bg-erp-dim rounded-sm overflow-hidden">
                  <div className={`h-full rounded-sm ${barCls}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </ErpCard>
        <ErpCard>
          <STitle>
            效期預警 <span className="text-[10px] text-erp-red ml-1">{expiring.length} 批需注意</span>
          </STitle>
          <div className="max-h-[220px] overflow-y-auto">
            <div className="overflow-x-auto">
              <Table>
                <ShadTableHeader>
                  <TableRow><ErpTableHeader>商品</ErpTableHeader><ErpTableHeader>批號</ErpTableHeader><ErpTableHeader>剩餘天</ErpTableHeader><ErpTableHeader>可用量</ErpTableHeader></TableRow>
                </ShadTableHeader>
                <TableBody>
                  {expiring.sort((a, b) => a.days - b.days).map((b) => (
                    <TableRow key={b.batch}>
                      <ErpTableCell>{b.sku}</ErpTableCell>
                      <ErpTableCell mono colorClass="muted-foreground">{b.batch}</ErpTableCell>
                      <ErpTableCell>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.days <= 7 ? "bg-erp-red/15 text-erp-red" : "bg-erp-yellow/15 text-erp-yellow"
                        }`}>
                          {b.days}天
                        </span>
                      </ErpTableCell>
                      <ErpTableCell colorClass="erp-green">{b.qty - b.rsv}</ErpTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ErpCard>
      </div>
      <ErpCard>
        <STitle>今日工作概覽</STitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "進行中工單", value: "2", colorClass: "erp-orange" },
            { label: "待驗收 PO", value: "3", colorClass: "erp-yellow" },
            { label: "今日出貨訂單", value: "5", colorClass: "erp-blue" },
            { label: "過期待處理批號", value: "2", colorClass: "erp-red" },
          ].map((k, i) => {
            const textMap: Record<string, string> = {
              "erp-orange": "text-erp-orange border-erp-orange/20",
              "erp-yellow": "text-erp-yellow border-erp-yellow/20",
              "erp-blue": "text-erp-blue border-erp-blue/20",
              "erp-red": "text-erp-red border-erp-red/20",
            };
            const cls = textMap[k.colorClass] || "";
            return (
              <div key={i} className={`bg-background border rounded-lg p-3.5 text-center ${cls}`}>
                <div className="text-[28px] font-bold">{k.value}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{k.label}</div>
              </div>
            );
          })}
        </div>
      </ErpCard>
    </div>
  );
}

export function DashTxn() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">今日庫存異動日誌</span>
        <Row className="gap-2">
          <ErpSelect className="w-[120px]">
            <option>全部類型</option><option>入庫</option><option>出庫</option><option>投料</option><option>調撥</option><option>報工</option>
          </ErpSelect>
          <Button variant="muted-foreground-ghost">匯出 CSV</Button>
        </Row>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(TXN_COLOR).map(([t, c]) => {
          const dotMap: Record<string, string> = {
            "erp-cyan": "bg-erp-cyan",
            "erp-blue": "bg-erp-blue",
            "erp-orange": "bg-erp-orange",
            "erp-purple": "bg-erp-purple",
            "erp-green": "bg-erp-green",
          };
          return (
            <span key={t} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={`w-2 h-2 rounded-sm ${dotMap[c] || "bg-muted-foreground"}`} />
              {t}: {TXNS.filter((x) => x.type === t).length}筆
            </span>
          );
        })}
      </div>
      <ErpCard>
        <div className="overflow-x-auto">
          <Table>
            <ShadTableHeader>
              <TableRow><ErpTableHeader>時間</ErpTableHeader><ErpTableHeader>類型</ErpTableHeader><ErpTableHeader>商品</ErpTableHeader><ErpTableHeader>批號</ErpTableHeader><ErpTableHeader>數量</ErpTableHeader><ErpTableHeader>倉位</ErpTableHeader><ErpTableHeader>操作人</ErpTableHeader></TableRow>
            </ShadTableHeader>
            <TableBody>
              {TXNS.map((r, i) => (
                <TableRow key={i} className="hover:bg-erp-blue/[0.04] transition-colors">
                  <ErpTableCell mono colorClass="muted-foreground">{r.time}</ErpTableCell>
                  <ErpTableCell><Badge variant={TXN_COLOR[r.type] as any}>{r.type}</Badge></ErpTableCell>
                  <ErpTableCell>{r.sku}</ErpTableCell>
                  <ErpTableCell mono colorClass="muted-foreground">{r.batch}</ErpTableCell>
                  <ErpTableCell bold colorClass={r.qty.startsWith("+") ? "erp-green" : r.qty.startsWith("-") ? "erp-red" : "erp-purple"}>
                    {r.qty}
                  </ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{r.loc}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{r.user}</ErpTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ErpCard>
    </div>
  );
}
