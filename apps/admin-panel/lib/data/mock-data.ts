/**
 * Mock Data for 鱘寶 ERP
 * 模擬資料（開發用）
 */

// 訂單資料
export const ORDERS = [
  {id:"SO-2026-0301",cust:"台北生鮮超市",status:"備貨中",items:3,total:12800,date:"2026-03-01",ship:"",type:"B2B"},
  {id:"SO-2026-0302",cust:"全聯福利中心",status:"處理中",items:5,total:35200,date:"2026-03-02",ship:"",type:"B2B"},
  {id:"SO-2026-0303",cust:"愛買量販店",  status:"已出貨",items:2,total:8400, date:"2026-02-28",ship:"2026-03-01",type:"B2B"},
  {id:"SO-2026-0304",cust:"家樂福",      status:"未付款",items:7,total:52000,date:"2026-03-03",ship:"",type:"B2B"},
  {id:"SO-2026-0305",cust:"頂好超市",    status:"已出貨",items:1,total:3200, date:"2026-02-27",ship:"2026-02-28",type:"B2B"},
  {id:"SO-2026-0306",cust:"陳小姐",      status:"處理中",items:2,total:5600, date:"2026-03-03",ship:"",type:"B2C"},
  {id:"SO-2026-0307",cust:"林先生",      status:"未付款",items:1,total:2800, date:"2026-03-04",ship:"",type:"B2C"},
  {id:"SO-2026-0308",cust:"松青超市",    status:"備貨中",items:4,total:18400,date:"2026-03-04",ship:"",type:"B2B"},
  {id:"SO-2026-0309",cust:"棉花田有機",  status:"已出貨",items:3,total:9600, date:"2026-03-01",ship:"2026-03-02",type:"B2B"},
  {id:"SO-2026-0310",cust:"楊小姐",      status:"已出貨",items:1,total:880,  date:"2026-02-26",ship:"2026-02-27",type:"B2C"},
];

export const STAT_COLOR: Record<string, string> = {
  未付款: "erp-yellow",
  處理中: "erp-blue",
  備貨中: "erp-orange",
  已出貨: "erp-green",
};

// 批號資料
export const BATCHES = [
  {batch:"260101-001",sku:"鱘魚片-500g",  qty:120,rsv:30,expiry:"2026-04-10",inbound:"2026-01-01",loc:"冷鏈A-01",days:37},
  {batch:"260115-002",sku:"鱘魚片-500g",  qty:80, rsv:0, expiry:"2026-04-25",inbound:"2026-01-15",loc:"冷鏈A-01",days:52},
  {batch:"260201-001",sku:"魚子醬-50g",   qty:45, rsv:15,expiry:"2026-03-18",inbound:"2026-02-01",loc:"冷鏈B-02",days:14},
  {batch:"260210-001",sku:"魚子醬-50g",   qty:60, rsv:0, expiry:"2026-03-25",inbound:"2026-02-10",loc:"冷鏈B-02",days:21},
  {batch:"260220-001",sku:"煙燻鱘魚-200g",qty:200,rsv:50,expiry:"2026-05-01",inbound:"2026-02-20",loc:"內倉C-03",days:58},
  {batch:"260101-003",sku:"原料-鱘魚原料",qty:500,rsv:100,expiry:"2026-03-08",inbound:"2026-01-01",loc:"冷鏈D-01",days:4},
  {batch:"260218-001",sku:"原料-魚子原料",qty:300,rsv:80,expiry:"2026-03-30",inbound:"2026-02-18",loc:"冷鏈D-02",days:26},
  {batch:"260225-001",sku:"魚子醬禮盒-3入",qty:35,rsv:5,expiry:"2026-03-22",inbound:"2026-02-25",loc:"內倉C-01",days:18},
  {batch:"260101-004",sku:"鱘魚卵-80g",   qty:90, rsv:20,expiry:"2026-03-05",inbound:"2026-01-01",loc:"冷鏈B-03",days:1},
  {batch:"260228-001",sku:"包材-玻璃罐",  qty:2000,rsv:0,expiry:"2027-12-31",inbound:"2026-02-28",loc:"內倉D-01",days:667},
  {batch:"260115-003",sku:"煙燻鱘魚-200g",qty:80, rsv:0, expiry:"2026-03-12",inbound:"2026-01-15",loc:"內倉C-04",days:8},
  {batch:"260304-001",sku:"鱘魚片-500g",  qty:200,rsv:0, expiry:"2026-04-30",inbound:"2026-03-04",loc:"冷鏈A-02",days:57},
];

// 採購單資料
export const POS = [
  {id:"PO-2026-0101",vendor:"龍騰水產",  status:"待驗收",items:3,amount:88000, created:"2026-02-28",eta:"2026-03-04"},
  {id:"PO-2026-0102",vendor:"海洋食材行",status:"已入庫",items:2,amount:45000, created:"2026-02-25",eta:"2026-03-01"},
  {id:"PO-2026-0103",vendor:"龍騰水產",  status:"草稿",  items:5,amount:120000,created:"2026-03-03",eta:"2026-03-10"},
  {id:"PO-2026-0104",vendor:"優質包材",  status:"已入庫",items:4,amount:22000, created:"2026-02-20",eta:"2026-02-24"},
  {id:"PO-2026-0105",vendor:"海洋食材行",status:"待驗收",items:1,amount:38000, created:"2026-03-03",eta:"2026-03-05"},
  {id:"PO-2026-0106",vendor:"鮮味水產",  status:"草稿",  items:2,amount:56000, created:"2026-03-04",eta:"2026-03-12"},
  {id:"PO-2026-0107",vendor:"龍騰水產",  status:"已入庫",items:3,amount:72000, created:"2026-02-18",eta:"2026-02-22"},
  {id:"PO-2026-0108",vendor:"生鮮配送",  status:"待驗收",items:2,amount:31500, created:"2026-03-02",eta:"2026-03-06"},
];

// 工單資料
export const WOS = [
  {id:"WO-2026-0201",prod:"魚子醬-50g (100件)",     status:"進行中",qty:100,progress:60, mat:["原料-魚子原料","包材-玻璃罐"],started:"2026-03-02"},
  {id:"WO-2026-0202",prod:"鱘魚禮盒-豪華版 (50件)",  status:"待生產",qty:50, progress:0,  mat:["鱘魚片-500g","包材-精裝盒"],started:""},
  {id:"WO-2026-0203",prod:"煙燻鱘魚套組 (200件)",    status:"完工",  qty:200,progress:100,mat:["原料-鱘魚原料","煙燻調料"],started:"2026-02-28"},
  {id:"WO-2026-0204",prod:"魚子醬禮盒-3入 (80件)",   status:"進行中",qty:80, progress:35, mat:["魚子醬-50g","包材-禮盒"],started:"2026-03-03"},
  {id:"WO-2026-0205",prod:"鱘魚片禮盒 (60件)",       status:"待生產",qty:60, progress:0,  mat:["鱘魚片-500g","包材-禮盒"],started:""},
  {id:"WO-2026-0206",prod:"鱘魚卵鹽漬罐 (150件)",    status:"完工",  qty:150,progress:100,mat:["原料-鱘魚卵","包材-玻璃罐"],started:"2026-02-25"},
];

// 商品資料
export const PRODS = [
  {sku:"SKU-F001",name:"新鮮鱘魚片 500g",  type:"成品",  price:320, cost:210,stock:400,bundle:false},
  {sku:"SKU-F002",name:"頂級魚子醬 50g",   type:"成品",  price:880, cost:520,stock:105,bundle:false},
  {sku:"SKU-F003",name:"煙燻鱘魚 200g",    type:"成品",  price:380, cost:280,stock:280,bundle:false},
  {sku:"SKU-F004",name:"鱘魚卵鹽漬 80g",   type:"成品",  price:650, cost:420,stock:90, bundle:false},
  {sku:"SKU-B001",name:"魚子醬禮盒 3入",   type:"成品",  price:2800,cost:1620,stock:35,bundle:true},
  {sku:"SKU-B002",name:"鱘魚片豪華禮盒",   type:"成品",  price:1800,cost:980,stock:20, bundle:true},
  {sku:"SKU-B003",name:"海鮮精選套組 6件", type:"成品",  price:4200,cost:2400,stock:12,bundle:true},
  {sku:"SKU-R001",name:"鱘魚原料 (冷凍)",  type:"原物料",price:180, cost:180,stock:400,bundle:false},
  {sku:"SKU-R002",name:"魚子原料 (新鮮)",  type:"原物料",price:560, cost:560,stock:300,bundle:false},
  {sku:"SKU-P001",name:"精裝禮盒",         type:"包材",  price:45,  cost:45, stock:3000,bundle:false},
  {sku:"SKU-P002",name:"玻璃罐 50ml",      type:"包材",  price:12,  cost:12, stock:2000,bundle:false},
];

// 供應商資料
export const VENDORS = [
  {name:"龍騰水產",  cat:"鱘魚、魚片",     terms:"月結30",qcRate:97,score:4.8,orders:12,contact:"王經理 0912-345-678"},
  {name:"海洋食材行",cat:"魚子原料",       terms:"月結45",qcRate:95,score:4.5,orders:8, contact:"陳業務 0922-456-789"},
  {name:"優質包材",  cat:"玻璃罐、禮盒",   terms:"月結60",qcRate:99,score:4.9,orders:15,contact:"林小姐 0933-567-890"},
  {name:"鮮味水產",  cat:"鱘魚卵、原料",   terms:"月結30",qcRate:96,score:4.6,orders:5, contact:"黃先生 0944-678-901"},
  {name:"生鮮配送",  cat:"各類鮮魚原料",   terms:"貨到付款",qcRate:93,score:4.2,orders:3,contact:"張組長 0955-789-012"},
];

// 交易紀錄
export const TXNS = [
  {time:"09:14",type:"入庫",sku:"鱘魚片 500g",   batch:"260304-001",qty:"+200",user:"倉管-陳大華",  loc:"冷鏈A-02"},
  {time:"09:38",type:"出庫",sku:"魚子醬 50g",    batch:"260201-001",qty:"-15", user:"倉管-李美玲",  loc:"冷鏈B-02"},
  {time:"10:05",type:"入庫",sku:"魚子醬禮盒",    batch:"260304-002",qty:"+50", user:"倉管-陳大華",  loc:"內倉C-01"},
  {time:"10:32",type:"出庫",sku:"鱘魚片 500g",   batch:"260101-001",qty:"-30", user:"倉管-趙大勇",  loc:"冷鏈A-01"},
  {time:"11:05",type:"投料",sku:"原料-鱘魚原料", batch:"260101-003",qty:"-80", user:"生產-王志強",  loc:"冷鏈D-01"},
  {time:"11:48",type:"出庫",sku:"煙燻鱘魚 200g", batch:"260220-001",qty:"-50", user:"倉管-李美玲",  loc:"內倉C-03"},
  {time:"13:20",type:"入庫",sku:"魚子醬-50g",    batch:"260304-003",qty:"+40", user:"倉管-陳大華",  loc:"冷鏈B-02"},
  {time:"13:55",type:"調撥",sku:"煙燻鱘魚 200g", batch:"260220-001",qty:"=50", user:"倉管-趙大勇",  loc:"C→A"},
  {time:"14:22",type:"投料",sku:"原料-魚子原料",  batch:"260218-001",qty:"-55", user:"生產-林秀芬",  loc:"冷鏈D-02"},
  {time:"15:10",type:"入庫",sku:"鱘魚卵鹽漬 80g",batch:"260304-004",qty:"+90", user:"倉管-陳大華",  loc:"冷鏈B-03"},
  {time:"15:44",type:"報工",sku:"魚子醬禮盒-3入",batch:"260304-005",qty:"+80", user:"生產-王志強",  loc:"內倉C-01"},
  {time:"16:30",type:"出庫",sku:"魚子醬禮盒-3入",batch:"260225-001",qty:"-10", user:"倉管-李美玲",  loc:"內倉C-01"},
];

export const TXN_COLOR: Record<string, string> = {
  入庫: "erp-cyan",
  出庫: "erp-blue",
  投料: "erp-orange",
  調撥: "erp-purple",
  報工: "erp-green",
};

// 應付帳款
export const AP = [
  {inv:"INV-A0301",vendor:"龍騰水產",  po:"PO-2026-0101",amount:88000,due:"2026-04-01",status:"待付款"},
  {inv:"INV-A0225",vendor:"海洋食材行",po:"PO-2026-0102",amount:45000,due:"2026-04-15",status:"核對中"},
  {inv:"INV-A0210",vendor:"優質包材",  po:"PO-2026-0104",amount:22000,due:"2026-03-10",status:"已付款"},
  {inv:"INV-A0303",vendor:"海洋食材行",po:"PO-2026-0105",amount:38000,due:"2026-04-18",status:"待付款"},
  {inv:"INV-A0218",vendor:"龍騰水產",  po:"PO-2026-0107",amount:72000,due:"2026-03-18",status:"已付款"},
  {inv:"INV-A0224",vendor:"優質包材",  po:"PO-2026-0098",amount:15500,due:"2026-03-24",status:"逾期"},
  {inv:"INV-A0220",vendor:"鮮味水產",  po:"PO-2026-0099",amount:56000,due:"2026-04-05",status:"待付款"},
  {inv:"INV-A0302",vendor:"生鮮配送",  po:"PO-2026-0108",amount:31500,due:"2026-04-06",status:"核對中"},
];

// 使用者資料
export const USERS = [
  {acc:"admin",   name:"系統管理員",role:"Admin", last:"2026-03-04 09:01",active:true},
  {acc:"sales01", name:"王業務",    role:"業務",  last:"2026-03-04 10:32",active:true},
  {acc:"sales02", name:"林業務",    role:"業務",  last:"2026-03-04 08:50",active:true},
  {acc:"wh01",    name:"陳大華",    role:"倉管",  last:"2026-03-04 08:15",active:true},
  {acc:"wh02",    name:"李美玲",    role:"倉管",  last:"2026-03-04 09:22",active:true},
  {acc:"wh03",    name:"趙大勇",    role:"倉管",  last:"2026-03-04 11:05",active:true},
  {acc:"prod01",  name:"王志強",    role:"生產",  last:"2026-03-03 17:40",active:true},
  {acc:"prod02",  name:"林秀芬",    role:"生產",  last:"2026-03-04 10:15",active:true},
  {acc:"pur01",   name:"採購林小姐",role:"採購",  last:"2026-03-03 16:20",active:true},
  {acc:"qc01",    name:"張主任",    role:"QC",    last:"2026-03-02 09:00",active:false},
  {acc:"qc02",    name:"黃品管",    role:"QC",    last:"2026-03-04 07:55",active:true},
  {acc:"fin01",   name:"財務陳會計",role:"財務",  last:"2026-03-04 09:50",active:true},
];
