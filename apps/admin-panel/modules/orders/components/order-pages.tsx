"use client";

import { useState, useMemo, useCallback, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Minus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──
interface OrderItem {
  name: string;
  listPrice: number;
  sellPrice: number;
  qty: number;
  discount: number;
  temperature: string;
}

interface Order {
  id: string;
  sDate: string;
  total: number;
  discount: number;
  final: number;
  payWay: string;
  payStatus: string;
  shipStatus: string;
  estShip: string;
  shipDate: string;
  shipNo: string;
  deliveryDate: string;
  logistics: string;
  logisticsNo: string;
  receiver: string;
  phone: string;
  address: string;
  invNo: string;
  taxId: string;
  invTitle: string;
  pos: string;
  note: string;
  items: OrderItem[];
}

// ── Mock Data ──
const INITIAL_ORDERS: Order[] = [
  {
    id: "SO-20260306-001", sDate: "2026-03-01", total: 1500, discount: 100, final: 1400,
    payWay: "轉帳", payStatus: "已付款", shipStatus: "備貨中", estShip: "2026-03-06",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "黑貓", logisticsNo: "",
    receiver: "吳淡如", phone: "0912-345-678", address: "台北市中山區南京東路三段100號",
    invNo: "AB-888999", taxId: "", invTitle: "", pos: "1shop", note: "VIP客戶",
    items: [{ name: "頂級魚子醬 50g", listPrice: 880, sellPrice: 750, qty: 2, discount: 100, temperature: "冷藏" }],
  },
  {
    id: "SO-20260306-002", sDate: "2026-03-02", total: 3200, discount: 0, final: 3200,
    payWay: "信用卡", payStatus: "未付款", shipStatus: "未出貨", estShip: "2026-03-08",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "新竹物流", logisticsNo: "",
    receiver: "林志玲", phone: "0922-456-789", address: "新北市板橋區文化路一段200號",
    invNo: "", taxId: "12345678", invTitle: "林氏企業", pos: "官方網站", note: "",
    items: [
      { name: "新鮮鱘魚片 500g", listPrice: 320, sellPrice: 320, qty: 5, discount: 0, temperature: "冷凍" },
      { name: "煙燻鱘魚 200g", listPrice: 380, sellPrice: 380, qty: 4, discount: 0, temperature: "冷藏" },
    ],
  },
  {
    id: "SO-20260306-003", sDate: "2026-03-03", total: 5600, discount: 200, final: 5400,
    payWay: "轉帳", payStatus: "已付款", shipStatus: "已出貨", estShip: "2026-03-05",
    shipDate: "2026-03-05", shipNo: "SH-0303-001", deliveryDate: "2026-03-07", logistics: "黑貓", logisticsNo: "CAT20260305001",
    receiver: "陳美麗", phone: "0933-567-890", address: "台中市西屯區台灣大道四段500號",
    invNo: "CD-123456", taxId: "", invTitle: "", pos: "ShopLine", note: "需冷藏配送",
    items: [
      { name: "魚子醬禮盒 3入", listPrice: 2800, sellPrice: 2700, qty: 2, discount: 200, temperature: "冷藏" },
    ],
  },
  {
    id: "SO-20260306-004", sDate: "2026-03-04", total: 880, discount: 0, final: 880,
    payWay: "信用卡", payStatus: "已付款", shipStatus: "備貨中", estShip: "2026-03-07",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "宅配通", logisticsNo: "",
    receiver: "王大明", phone: "0955-789-012", address: "高雄市前鎮區中山二路100號",
    invNo: "", taxId: "", invTitle: "", pos: "團購表單", note: "團購訂單",
    items: [{ name: "頂級魚子醬 50g", listPrice: 880, sellPrice: 880, qty: 1, discount: 0, temperature: "常溫" }],
  },
  {
    id: "SO-20260306-005", sDate: "2026-03-04", total: 2400, discount: 100, final: 2300,
    payWay: "轉帳", payStatus: "已付款", shipStatus: "備貨中", estShip: "2026-03-09",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "黑貓", logisticsNo: "",
    receiver: "李小華", phone: "0966-123-456", address: "桃園市中壢區中央路50號",
    invNo: "EF-654321", taxId: "", invTitle: "", pos: "1shop", note: "",
    items: [
      { name: "鱘魚排 300g", listPrice: 600, sellPrice: 580, qty: 2, discount: 50, temperature: "冷凍" },
      { name: "魚子醬 30g", listPrice: 650, sellPrice: 620, qty: 2, discount: 50, temperature: "冷藏" },
    ],
  },
  {
    id: "SO-20260306-006", sDate: "2026-03-05", total: 1200, discount: 0, final: 1200,
    payWay: "信用卡", payStatus: "未付款", shipStatus: "未出貨", estShip: "2026-03-10",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "新竹物流", logisticsNo: "",
    receiver: "張美玲", phone: "0977-234-567", address: "台南市東區大學路一段1號",
    invNo: "", taxId: "87654321", invTitle: "張記食品", pos: "官方網站", note: "需統編發票",
    items: [{ name: "煙燻鱘魚 200g", listPrice: 400, sellPrice: 400, qty: 3, discount: 0, temperature: "冷藏" }],
  },
  {
    id: "SO-20260306-007", sDate: "2026-03-05", total: 4500, discount: 300, final: 4200,
    payWay: "轉帳", payStatus: "已付款", shipStatus: "已出貨", estShip: "2026-03-06",
    shipDate: "2026-03-06", shipNo: "SH-0305-001", deliveryDate: "2026-03-08", logistics: "黑貓", logisticsNo: "CAT20260306001",
    receiver: "周杰倫", phone: "0988-345-678", address: "台北市大安區忠孝東路四段250號",
    invNo: "GH-789012", taxId: "", invTitle: "", pos: "ShopLine", note: "加急處理",
    items: [
      { name: "頂級魚子醬 100g", listPrice: 1600, sellPrice: 1500, qty: 3, discount: 300, temperature: "冷藏" },
    ],
  },
  {
    id: "SO-20260306-008", sDate: "2026-03-05", total: 960, discount: 0, final: 960,
    payWay: "貨到付款", payStatus: "未付款", shipStatus: "備貨中", estShip: "2026-03-08",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "宅配通", logisticsNo: "",
    receiver: "劉德華", phone: "0911-456-789", address: "新竹市東區光復路二段101號",
    invNo: "", taxId: "", invTitle: "", pos: "團購表單", note: "",
    items: [
      { name: "鱘魚片 250g", listPrice: 240, sellPrice: 240, qty: 4, discount: 0, temperature: "冷凍" },
    ],
  },
  {
    id: "SO-20260306-009", sDate: "2026-03-06", total: 1800, discount: 50, final: 1750,
    payWay: "信用卡", payStatus: "已付款", shipStatus: "未出貨", estShip: "2026-03-11",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "黑貓", logisticsNo: "",
    receiver: "蔡依林", phone: "0922-567-890", address: "台北市信義區松仁路100號",
    invNo: "IJ-345678", taxId: "", invTitle: "", pos: "1shop", note: "生日禮物",
    items: [
      { name: "魚子醬禮盒 3入", listPrice: 2800, sellPrice: 1800, qty: 1, discount: 50, temperature: "冷藏" },
    ],
  },
  {
    id: "SO-20260306-010", sDate: "2026-03-06", total: 640, discount: 0, final: 640,
    payWay: "轉帳", payStatus: "未付款", shipStatus: "未出貨", estShip: "2026-03-12",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "新竹物流", logisticsNo: "",
    receiver: "孫燕姿", phone: "0933-678-901", address: "台中市北屯區文心路四段200號",
    invNo: "", taxId: "", invTitle: "", pos: "官方網站", note: "",
    items: [
      { name: "新鮮鱘魚片 500g", listPrice: 320, sellPrice: 320, qty: 2, discount: 0, temperature: "冷凍" },
    ],
  },
  {
    id: "SO-20260306-011", sDate: "2026-03-06", total: 2200, discount: 150, final: 2050,
    payWay: "信用卡", payStatus: "已付款", shipStatus: "備貨中", estShip: "2026-03-09",
    shipDate: "", shipNo: "", deliveryDate: "", logistics: "黑貓", logisticsNo: "",
    receiver: "郭富城", phone: "0944-789-012", address: "高雄市鼓山區美術東二路50號",
    invNo: "KL-901234", taxId: "", invTitle: "", pos: "ShopLine", note: "",
    items: [
      { name: "頂級魚子醬 50g", listPrice: 880, sellPrice: 850, qty: 2, discount: 100, temperature: "冷藏" },
      { name: "煙燻鱘魚 200g", listPrice: 380, sellPrice: 380, qty: 1, discount: 50, temperature: "冷藏" },
    ],
  },
  {
    id: "SO-20260306-012", sDate: "2026-03-06", total: 1600, discount: 0, final: 1600,
    payWay: "轉帳", payStatus: "已付款", shipStatus: "已出貨", estShip: "2026-03-07",
    shipDate: "2026-03-07", shipNo: "SH-0306-001", deliveryDate: "2026-03-09", logistics: "黑貓", logisticsNo: "CAT20260307001",
    receiver: "黎明", phone: "0955-890-123", address: "台北市松山區民生東路五段100號",
    invNo: "MN-567890", taxId: "11223344", invTitle: "黎記國際", pos: "1shop", note: "公司訂購",
    items: [
      { name: "鱘魚排 300g", listPrice: 600, sellPrice: 600, qty: 2, discount: 0, temperature: "冷凍" },
      { name: "鱘魚片 250g", listPrice: 240, sellPrice: 200, qty: 2, discount: 0, temperature: "冷凍" },
    ],
  },
];

const PAY_STATUS_STYLE: Record<string, string> = {
  "已付款": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  "未付款": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
};

const SHIP_STATUS_STYLE: Record<string, string> = {
  "已出貨": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  "備貨中": "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  "未出貨": "bg-muted text-muted-foreground border-border",
};

const TEMP_OPTIONS = ["常溫", "冷藏", "冷凍", "其他"];

// ── Main Export with Tabs ──
export function OrderList() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="sticky top-0 z-20 bg-background border-b border-border px-4 pt-3">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-transparent rounded-none w-full justify-start h-auto p-0 gap-0">
            <TabsTrigger
              value="orders"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium"
            >
              訂單管理
            </TabsTrigger>
            <TabsTrigger
              value="salespoints"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium"
            >
              銷售點維護
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-0 flex-1 overflow-hidden">
            <OrderListContent />
          </TabsContent>
          <TabsContent value="salespoints" className="mt-0 flex-1 overflow-hidden">
            <SalesPointMaintenance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Order List Content ──
function OrderListContent() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterShipDays, setFilterShipDays] = useState<number | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.receiver.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }
    if (filterPlatform) {
      list = list.filter((o) => o.pos === filterPlatform);
    }
    if (filterShipDays) {
      const now = new Date();
      list = list.filter((o) => {
        if (!o.estShip) return false;
        const diff = (new Date(o.estShip).getTime() - now.getTime()) / 86400000;
        return diff >= 0 && diff <= filterShipDays;
      });
    }
    return list;
  }, [orders, search, filterPlatform, filterShipDays]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedOrders = filteredOrders.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleAll = useCallback(() => {
    if (selectedIds.size === pagedOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pagedOrders.map((o) => o.id)));
    }
  }, [pagedOrders, selectedIds]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    if (window.confirm(`確定要刪除訂單 ${id} 嗎？`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  }, []);

  const clearFilters = () => {
    setFilterShipDays(null);
    setFilterPlatform(null);
    setSearch("");
    setCurrentPage(1);
  };

  const hasFilters = !!filterShipDays || !!filterPlatform || !!search;

  const makeEmptyOrder = (): Order => ({
    id: `SO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(orders.length + 1).padStart(3, "0")}`,
    sDate: new Date().toISOString().slice(0, 10),
    total: 0, discount: 0, final: 0,
    payWay: "信用卡", payStatus: "未付款", shipStatus: "未出貨",
    estShip: "", shipDate: "", shipNo: "", deliveryDate: "",
    logistics: "黑貓", logisticsNo: "",
    receiver: "", phone: "", address: "",
    invNo: "", taxId: "", invTitle: "",
    pos: "官方網站", note: "",
    items: [{ name: "", listPrice: 0, sellPrice: 0, qty: 1, discount: 0, temperature: "常溫" }],
  });

  const handleSave = (order: Order) => {
    const recalc = recalcOrder(order);
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === recalc.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = recalc;
        return next;
      }
      return [...prev, recalc];
    });
    setEditOrder(null);
    setIsCreating(false);
  };

  // Column count for expand row
  const colCount = 25;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between px-4 pt-4 pb-2 shrink-0">
        <h2 className="text-base font-semibold text-foreground">訂單</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Import */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                匯入訂單 <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["出貨單", "批次發票", "黑貓", "1shop", "ShopLine", "團購表單", "批次匯入訂單範本"].map((item) => (
                <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Payment */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                收款動作 <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>收款</DropdownMenuItem>
              <DropdownMenuItem>取消收款</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Batch Ship */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                批次出貨 <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>批次出貨</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                匯出 <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>匯出 Excel</DropdownMenuItem>
              <DropdownMenuItem>匯出 CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create */}
          <Button
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              setEditOrder(makeEmptyOrder());
              setIsCreating(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" /> 建立訂單
          </Button>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={cn("gap-1.5 text-xs", hasFilters && "border-primary text-primary")}>
                篩選 <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>預計出貨天數</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {[3, 5, 7].map((d) => (
                    <DropdownMenuItem key={d} onClick={() => { setFilterShipDays(d); setCurrentPage(1); }}>近 {d} 天</DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>網購平台</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {["1shop", "ShopLine", "團購表單", "官方網站"].map((p) => (
                    <DropdownMenuItem key={p} onClick={() => { setFilterPlatform(p); setCurrentPage(1); }}>{p}</DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={clearFilters}>
                取消篩選
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <Input
            placeholder="搜尋編號/收件人/電話…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="h-8 w-full sm:w-48 text-xs"
          />
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-4 pb-2 shrink-0">
          <span>篩選中：</span>
          {filterShipDays && (
            <Badge variant="secondary" className="text-[10px]">出貨 ≤ {filterShipDays} 天</Badge>
          )}
          {filterPlatform && (
            <Badge variant="secondary" className="text-[10px]">{filterPlatform}</Badge>
          )}
          <Button variant="ghost" size="sm" className="h-5 px-1 text-[10px] text-destructive" onClick={clearFilters}>
            清除
          </Button>
        </div>
      )}

      {/* Scrollable Table */}
      <div className="flex-1 overflow-auto min-h-0 px-4">
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10 text-center">
                    <Checkbox
                      checked={pagedOrders.length > 0 && selectedIds.size === pagedOrders.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="w-10 text-center text-xs font-semibold"></TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">編號</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">銷售日期</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">總金額</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">折扣</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">折扣後金額</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">付款方式</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">付款狀態</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">出貨狀態</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-primary">預計出貨日</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">出貨日期</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">出貨單號</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">指定送達日</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">物流廠商</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">物流編號</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">收件人</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">收件電話</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap min-w-[200px]">收件地址</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-primary">發票號碼</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">統一編號</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">發票抬頭</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">銷售點</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap min-w-[160px]">備註</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-center w-20 sticky right-0 bg-muted/50 border-l border-border z-10">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedOrders.map((o) => {
                  const isExpanded = expandedIds.has(o.id);
                  return (
                    <Fragment key={o.id}>
                      <TableRow className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="text-center">
                          <Checkbox checked={selectedIds.has(o.id)} onCheckedChange={() => toggleOne(o.id)} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleExpand(o.id)}
                          >
                            {isExpanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          </Button>
                        </TableCell>
                        <TableCell className="font-semibold text-primary text-xs whitespace-nowrap">
                          {o.id}
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{o.sDate}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">NT${o.total.toLocaleString()}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">NT${o.discount.toLocaleString()}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap font-semibold text-emerald-600 dark:text-emerald-400">
                          NT${o.final.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{o.payWay}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className={cn("text-[10px]", PAY_STATUS_STYLE[o.payStatus])}>
                            {o.payStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className={cn("text-[10px]", SHIP_STATUS_STYLE[o.shipStatus])}>
                            {o.shipStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-primary font-medium">{o.estShip || "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{o.shipDate || "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-muted-foreground font-mono">{o.shipNo || "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{o.deliveryDate || "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{o.logistics}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-muted-foreground font-mono">{o.logisticsNo || "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{o.receiver}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{o.phone}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{o.address}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-primary font-semibold">{o.invNo || "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{o.taxId || "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{o.invTitle || "—"}</TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{o.pos}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{o.note || "—"}</TableCell>
                        <TableCell className="text-center sticky right-0 bg-card border-l border-border z-[5] group-hover:bg-muted/30 transition-colors">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px]">
                                動作 <ChevronDown className="h-3 w-3 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditOrder(o); setIsCreating(false); }}>
                                <Pencil className="h-3.5 w-3.5 mr-2" /> 編輯
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => deleteOrder(o.id)}>
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> 刪除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {/* Expanded items sub-table */}
                      {isExpanded && (
                        <TableRow className="bg-muted/20">
                          <TableCell colSpan={colCount} className="p-0">
                            <div className="px-12 py-3">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-muted/40">
                                    <TableHead className="text-[10px] font-semibold w-10 text-center">#</TableHead>
                                    <TableHead className="text-[10px] font-semibold">項目名稱</TableHead>
                                    <TableHead className="text-[10px] font-semibold">定價</TableHead>
                                    <TableHead className="text-[10px] font-semibold">售價</TableHead>
                                    <TableHead className="text-[10px] font-semibold">數量</TableHead>
                                    <TableHead className="text-[10px] font-semibold">小計</TableHead>
                                    <TableHead className="text-[10px] font-semibold">折扣金額</TableHead>
                                    <TableHead className="text-[10px] font-semibold">折扣後小計</TableHead>
                                    <TableHead className="text-[10px] font-semibold">溫層</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {o.items.map((item, idx) => {
                                    const subtotal = item.sellPrice * item.qty;
                                    const finalSub = subtotal - item.discount;
                                    return (
                                      <TableRow key={idx}>
                                        <TableCell className="text-[11px] text-center text-muted-foreground">{idx + 1}</TableCell>
                                        <TableCell className="text-[11px] font-medium">{item.name}</TableCell>
                                        <TableCell className="text-[11px]">NT${item.listPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-[11px]">NT${item.sellPrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-[11px]">{item.qty}</TableCell>
                                        <TableCell className="text-[11px]">NT${subtotal.toLocaleString()}</TableCell>
                                        <TableCell className="text-[11px] text-destructive">{item.discount > 0 ? `-NT$${item.discount.toLocaleString()}` : "—"}</TableCell>
                                        <TableCell className="text-[11px] font-semibold">NT${finalSub.toLocaleString()}</TableCell>
                                        <TableCell className="text-[11px]">
                                          <Badge variant="outline" className="text-[10px]">{item.temperature}</Badge>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
                {pagedOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={colCount} className="text-center py-12 text-muted-foreground text-sm">
                      無符合條件的訂單
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Fixed Pagination Footer */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-border bg-background">
        {/* Page size selector */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>每頁顯示</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>項記錄</span>
          <span className="ml-2 text-muted-foreground">
            共 {filteredOrders.length} 筆
          </span>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(safePage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {generatePageNumbers(safePage, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted-foreground">...</span>
            ) : (
              <Button
                key={p}
                variant={p === safePage ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0 text-xs"
                onClick={() => setCurrentPage(p as number)}
              >
                {p}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(safePage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Order Modal */}
      {editOrder && (
        <OrderModal
          order={editOrder}
          isNew={isCreating}
          onClose={() => { setEditOrder(null); setIsCreating(false); }}
          onSave={handleSave}
        />
      )}
    </div>
  );  /* end OrderListContent */
}

// ── Page number generator ──
function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

// ── Recalc helper ──
function recalcOrder(order: Order): Order {
  const total = order.items.reduce((s, i) => s + i.sellPrice * i.qty, 0);
  const discount = order.items.reduce((s, i) => s + i.discount, 0);
  return { ...order, total, discount, final: total - discount };
}

// ── Order Modal ──
function OrderModal({
  order,
  isNew,
  onClose,
  onSave,
}: {
  order: Order;
  isNew: boolean;
  onClose: () => void;
  onSave: (o: Order) => void;
}) {
  const [form, setForm] = useState<Order>({ ...order, items: order.items.map((i) => ({ ...i })) });

  const updateField = <K extends keyof Order>(key: K, val: Order[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const updateItem = (idx: number, field: keyof OrderItem, val: string | number) => {
    setForm((prev) => {
      const items = prev.items.map((item, i) =>
        i === idx ? { ...item, [field]: typeof item[field] === "number" ? Number(val) || 0 : val } : item
      );
      return { ...prev, items };
    });
  };

  const addItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", listPrice: 0, sellPrice: 0, qty: 1, discount: 0, temperature: "常溫" }],
    }));

  const removeItem = (idx: number) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));

  const grandTotal = form.items.reduce((s, i) => s + (i.sellPrice * i.qty - i.discount), 0);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-sm font-semibold">
            {isNew ? "建立新訂單" : `編輯訂單：${form.id}`}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 flex-1 overflow-y-auto min-h-0">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sales Info */}
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <span className="text-xs font-semibold text-primary">銷售資訊</span>
                <div className="space-y-2">
                  <FieldRow label="銷售單號">
                    <Input value={form.id} readOnly className="h-8 text-xs bg-muted font-semibold text-primary" />
                  </FieldRow>
                  <FieldRow label="銷售日期">
                    <Input type="date" value={form.sDate} onChange={(e) => updateField("sDate", e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                  <FieldRow label="銷售點">
                    <Select value={form.pos} onValueChange={(v) => updateField("pos", v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["官方網站", "1shop", "ShopLine", "團購表單"].map((p) => (
                          <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldRow>
                  <FieldRow label="客戶姓名">
                    <Input value={form.receiver} onChange={(e) => updateField("receiver", e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Invoice */}
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <span className="text-xs font-semibold text-primary">付款與發票</span>
                <div className="space-y-2">
                  <FieldRow label="付款方式 / 狀態">
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={form.payWay} onValueChange={(v) => updateField("payWay", v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["信用卡", "轉帳", "貨到付款"].map((p) => (
                            <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={form.payStatus} onValueChange={(v) => updateField("payStatus", v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["未付款", "已付款"].map((p) => (
                            <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FieldRow>
                  <FieldRow label="發票號碼">
                    <Input value={form.invNo} onChange={(e) => updateField("invNo", e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                  <FieldRow label="統一編號 / 抬頭">
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={form.taxId} onChange={(e) => updateField("taxId", e.target.value)} placeholder="統編" className="h-8 text-xs" />
                      <Input value={form.invTitle} onChange={(e) => updateField("invTitle", e.target.value)} placeholder="抬頭" className="h-8 text-xs" />
                    </div>
                  </FieldRow>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <span className="text-xs font-semibold text-primary">配送資訊</span>
                <div className="space-y-2">
                  <FieldRow label="收件人 / 電話">
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={form.receiver} onChange={(e) => updateField("receiver", e.target.value)} className="h-8 text-xs" />
                      <Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="h-8 text-xs" />
                    </div>
                  </FieldRow>
                  <FieldRow label="收件地址">
                    <Textarea value={form.address} onChange={(e) => updateField("address", e.target.value)} className="text-xs min-h-[36px] resize-none" />
                  </FieldRow>
                  <FieldRow label="預計出貨日 / 狀態">
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" value={form.estShip} onChange={(e) => updateField("estShip", e.target.value)} className="h-8 text-xs" />
                      <Select value={form.shipStatus} onValueChange={(v) => updateField("shipStatus", v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["未出貨", "備貨中", "已出貨"].map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FieldRow>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">項目詳情</span>
                <Button variant="outline" size="sm" className="h-7 text-[11px] text-emerald-600 border-emerald-500/30 gap-1" onClick={addItem}>
                  <Plus className="h-3 w-3" /> 新增項目
                </Button>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="grid grid-cols-[30px_2fr_1fr_1fr_0.7fr_1fr_0.8fr_1.2fr_1fr_36px] gap-2 px-2 py-1.5 text-[10px] font-semibold text-muted-foreground border-b border-border">
                    <div>#</div>
                    <div>項目名稱</div>
                    <div>定價</div>
                    <div>售價</div>
                    <div>數量</div>
                    <div>小計</div>
                    <div>折扣</div>
                    <div>折扣後小計</div>
                    <div>溫層</div>
                    <div></div>
                  </div>
                  {/* Rows */}
                  {form.items.map((item, idx) => {
                    const subtotal = item.sellPrice * item.qty;
                    const finalSub = subtotal - item.discount;
                    return (
                      <div key={idx} className="grid grid-cols-[30px_2fr_1fr_1fr_0.7fr_1fr_0.8fr_1.2fr_1fr_36px] gap-2 px-2 py-1.5 items-center border-b border-border/50">
                        <span className="text-[10px] text-muted-foreground text-center">{idx + 1}</span>
                        <Input value={item.name} onChange={(e) => updateItem(idx, "name", e.target.value)} placeholder="商品名稱" className="h-7 text-xs" />
                        <Input type="number" value={item.listPrice || ""} onChange={(e) => updateItem(idx, "listPrice", e.target.value)} className="h-7 text-xs" />
                        <Input type="number" value={item.sellPrice || ""} onChange={(e) => updateItem(idx, "sellPrice", e.target.value)} className="h-7 text-xs" />
                        <Input type="number" value={item.qty || ""} onChange={(e) => updateItem(idx, "qty", e.target.value)} className="h-7 text-xs" />
                        <div className="text-xs text-center">{subtotal.toLocaleString()}</div>
                        <Input type="number" value={item.discount || ""} onChange={(e) => updateItem(idx, "discount", e.target.value)} className="h-7 text-xs" />
                        <div className="text-xs text-center font-semibold">NT${finalSub.toLocaleString()}</div>
                        <Select value={item.temperature} onValueChange={(v) => updateItem(idx, "temperature", v)}>
                          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TEMP_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeItem(idx)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note + Total */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
            <Card className="border-border">
              <CardContent className="p-4">
                <Label className="text-xs font-semibold mb-2 block">訂單總備註</Label>
                <Textarea
                  value={form.note}
                  onChange={(e) => updateField("note", e.target.value)}
                  className="text-xs min-h-[60px] resize-none"
                />
              </CardContent>
            </Card>
            <div className="flex flex-col items-end justify-center px-4">
              <span className="text-xs text-muted-foreground mb-1">Grand Total</span>
              <span className="text-2xl font-bold text-foreground">NT${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={() => onSave(form)}>確認儲存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Tiny Field Row ──
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[10px] text-muted-foreground mb-1 block">{label}</Label>
      {children}
    </div>
  );
}

// ── Sales Point Types & Data ──
interface SalesPoint {
  id: string;
  type: string;
  name: string;
  shortName: string;
  phone: string;
  mobile: string;
  address: string;
  note: string;
}

const INITIAL_SALES_POINTS: SalesPoint[] = [
  { id: "SP01", type: "直營店", name: "總公司", shortName: "", phone: "", mobile: "", address: "", note: "" },
  { id: "SP04", type: "直營店", name: "1shop", shortName: "", phone: "", mobile: "", address: "", note: "" },
  { id: "SP05", type: "直營店", name: "團購表單", shortName: "", phone: "", mobile: "", address: "", note: "" },
  { id: "SP06", type: "直營店", name: "ShopLine", shortName: "", phone: "", mobile: "", address: "", note: "" },
];

// ── Sales Point Maintenance ──
function SalesPointMaintenance() {
  const [points, setPoints] = useState<SalesPoint[]>(INITIAL_SALES_POINTS);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<SalesPoint | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return points;
    const q = search.toLowerCase();
    return points.filter(
      (p) => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)
    );
  }, [points, search]);

  const handleNew = () => {
    const nextId = `SP${String(points.length + 1).padStart(2, "0")}`;
    setEditing({ id: nextId, type: "直營店", name: "", shortName: "", phone: "", mobile: "", address: "", note: "" });
    setIsNew(true);
  };

  const handleSave = (sp: SalesPoint) => {
    setPoints((prev) => {
      const idx = prev.findIndex((p) => p.id === sp.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = sp;
        return next;
      }
      return [...prev, sp];
    });
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`確定要刪除銷售點 ${id} 嗎？`)) {
      setPoints((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Form view
  if (editing) {
    return <SalesPointForm point={editing} isNew={isNew} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} />;
  }

  // List view
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-2 shrink-0">
        <h2 className="text-base font-semibold text-foreground">銷售點</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm w-48"
            />
          </div>
          <Button size="sm" onClick={handleNew}>
            新增
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0 px-4 pb-4">
      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold text-center">編號</TableHead>
                <TableHead className="text-xs font-semibold text-center">銷售點類型</TableHead>
                <TableHead className="text-xs font-semibold text-center">名稱</TableHead>
                <TableHead className="text-xs font-semibold text-center">機台</TableHead>
                <TableHead className="text-xs font-semibold text-center">電話</TableHead>
                <TableHead className="text-xs font-semibold text-center">聯絡地址</TableHead>
                <TableHead className="text-xs font-semibold text-center">備註</TableHead>
                <TableHead className="text-xs font-semibold text-center w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sp) => (
                <TableRow key={sp.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs text-center">{sp.id}</TableCell>
                  <TableCell className="text-xs text-center">{sp.type}</TableCell>
                  <TableCell className="text-xs text-center">{sp.name}</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">--</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">{sp.phone || "--"}</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">{sp.address || "--"}</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">{sp.note || "--"}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => { setEditing(sp); setIsNew(false); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(sp.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                    無符合條件的銷售點
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

// ── Sales Point Form ──
function SalesPointForm({
  point,
  isNew,
  onSave,
  onCancel,
}: {
  point: SalesPoint;
  isNew: boolean;
  onSave: (sp: SalesPoint) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<SalesPoint>({ ...point });

  const update = <K extends keyof SalesPoint>(key: K, val: SalesPoint[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" /> 銷售點
        </button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-primary border-primary" onClick={() => onSave(form)}>
            儲存
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel}>
            取消
          </Button>
        </div>
      </div>

      <Card className="border-border">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">編號</Label>
              <Input value={form.id} readOnly className="bg-muted" />
            </div>
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">
                銷售點類型 <span className="text-destructive">*</span>
              </Label>
              <Select value={form.type} onValueChange={(v) => update("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["直營店", "經銷商", "線上平台", "其他"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">
                名稱 <span className="text-destructive">*</span>
              </Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">簡稱</Label>
              <Input value={form.shortName} onChange={(e) => update("shortName", e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">電話</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">手機</Label>
              <Input value={form.mobile} onChange={(e) => update("mobile", e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-sm text-foreground mb-1.5 block">聯絡地址</Label>
            <Input value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div>
            <Label className="text-sm text-foreground mb-1.5 block">備註</Label>
            <Textarea
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
