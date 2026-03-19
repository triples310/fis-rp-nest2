# 🚀 快速啟動指南

## 首次設置

### 方法 1：本機開發（推薦用於開發）

```bash
# 1. 安裝依賴
npm run install:all

# 2. 配置環境變數
cp apps/backend/.env.example apps/backend/.env
cp apps/admin-panel/.env.example apps/admin-panel/.env

# 3. 啟動 PostgreSQL（使用 Docker）
docker-compose up postgres -d

# 4. 初始化資料庫
npm run prisma:generate
npm run prisma:migrate

# 5. 啟動開發伺服器
# 終端 1
npm run dev:backend

# 終端 2
npm run dev:admin
```

**訪問：**
- Admin Panel: http://localhost:3000
- Backend API: http://localhost:3001

---

### 方法 2：完整 Docker 部署

```bash
# 1. 配置環境變數
cp .env.example .env
vim .env  # 修改密碼

# 2. 啟動所有服務
docker-compose up --build -d

# 3. 查看日誌
docker-compose logs -f
```

**訪問：**
- Admin Panel: http://localhost:3000
- Backend API: http://localhost:3001

---

## 常見問題

### Q: Backend 無法啟動？
```bash
# 檢查日誌
docker-compose logs backend

# 重啟服務
docker-compose restart backend
```

### Q: 如何重置資料庫？
```bash
npm run prisma:migrate reset
```

### Q: 如何查看資料庫？
```bash
npm run prisma:studio
# 訪問 http://localhost:5555
```

---

## 下一步

查看完整文件：[README.md](./README.md)
