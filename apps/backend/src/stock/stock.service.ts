import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { QueryStockDto } from './dto/query-stock.dto';
import { v4 as uuidv4 } from 'uuid';

// ─── Why snake_case everywhere? ─────────────────────────────────────────────
// The tables were migrated from MySQL with their original snake_case names
// (stock, stock_brand, stock_category, stock_price …).  Prisma introspects
// the existing DB and keeps the snake_case names as-is, so the generated
// client exposes:  prisma.stock_brand  prisma.stock_category  etc.
// Field names are also snake_case:  company_id, stock_id, price_type_id …
// ────────────────────────────────────────────────────────────────────────────

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // STOCK CRUD
  // ============================================================

  async createStock(
    dto: CreateStockDto,
    operatorId = 'system',
    operatorName = 'system',
  ) {
    const companyId = dto.companyId || 'i2csolution';

    // ── Auto-generate code ──────────────────────────────────
    let code = dto.code;
    if (!code) {
      const category = await this.prisma.stock_category.findUnique({
        where: { id: dto.stockCategoryId },
      });
      if (!category) throw new NotFoundException('Stock category not found');

      const countryUpper = dto.countryId.toUpperCase();
      if (dto.barcode) {
        code = `${category.code}${countryUpper}${dto.barcode.slice(-4)}`;
      } else {
        const prefix = `${category.code}${countryUpper}`;
        const count = await this.prisma.stock.count({
          where: { code: { startsWith: prefix }, barcode: null },
        });
        code = `${prefix}A${String(count + 1).padStart(3, '0')}`;
      }
    }

    // ── Max sorting ─────────────────────────────────────────
    const lastStock = await this.prisma.stock.findFirst({
      where: { company_id: companyId },
      orderBy: { sorting: 'desc' },
    });
    // sorting is bigint in PG – convert explicitly
    const sorting = lastStock ? Number(lastStock.sorting) + 1 : 1;

    const stockId = uuidv4();

    // ── Transaction ─────────────────────────────────────────
    const stock = await this.prisma.$transaction(async (tx) => {
      // 1. Stock record
      const newStock = await tx.stock.create({
        data: {
          id: stockId,
          company_id: companyId,
          sorting,
          code,
          name: dto.name,
          short_name: dto.shortName ?? null,
          barcode: dto.barcode ?? null,
          stock_category_id: dto.stockCategoryId,
          stock_brand_id: dto.stockBrandId,
          country_id: dto.countryId,
          stock_unit_id: dto.stockUnitId,
          mbflag_type_id: dto.mbflagTypeId,
          tax_type_id: dto.taxTypeId || 'tx',
          description: dto.description ?? null,
          valid: dto.valid ?? true,
          serial_stock: dto.serialStock ?? false,
          consignment: dto.consignment ?? false,
          gift: dto.gift ?? false,
          create_id: operatorId,
          create_name: operatorName,
        },
      });

      // 2. Fixed price
      if (dto.fixedPrice !== undefined && dto.fixedPrice !== null) {
        await tx.stock_price.create({
          data: {
            id: uuidv4(),
            stock_id: stockId,
            sorting: 1,
            price_type_id: 'fixed',
            country_id: 'tw',
            currencies_id: 'TWD',
            price: dto.fixedPrice,
            effective_date_start: new Date(),
            create_id: operatorId,
            create_name: operatorName,
          },
        });
      }

      // 3. Retail price
      if (dto.retailPrice !== undefined && dto.retailPrice !== null) {
        await tx.stock_price.create({
          data: {
            id: uuidv4(),
            stock_id: stockId,
            sorting: 1,
            price_type_id: 'retail',
            country_id: 'tw',
            currencies_id: 'TWD',
            price: dto.retailPrice,
            effective_date_start: new Date(),
            create_id: operatorId,
            create_name: operatorName,
          },
        });
      }

      // 4. Suppliers
      if (dto.partnerId && dto.partnerId.length > 0) {
        await tx.stock_supplier.createMany({
          data: dto.partnerId.map((partnerId) => ({
            id: uuidv4(),
            stock_id: stockId,
            partner_id: partnerId,
            create_id: operatorId,
            create_name: operatorName,
          })),
        });
      }

      return newStock;
    });

    return this.getStockById(stock.id);
  }

  async getStocks(query: QueryStockDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.name) where.name = { contains: filters.name };
    if (filters.code) where.code = { contains: filters.code };
    if (filters.barcode) where.barcode = { contains: filters.barcode };
    if (filters.stockCategoryId)
      where.stock_category_id = filters.stockCategoryId;
    if (filters.stockBrandId) where.stock_brand_id = filters.stockBrandId;
    if (filters.mbflagTypeId) where.mbflag_type_id = filters.mbflagTypeId;
    if (filters.partnerId) {
      where.stock_supplier = { some: { partner_id: filters.partnerId } };
    }

    const [list, total] = await Promise.all([
      this.prisma.stock.findMany({
        where,
        skip,
        take: limit,
        orderBy: { code: 'asc' },
        include: this._stockIncludes(),
      }),
      this.prisma.stock.count({ where }),
    ]);

    return {
      list: list.map((s) => this._formatStock(s)),
      total,
      page,
      limit,
    };
  }

  async getStockById(id: string) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
      include: this._stockIncludes(),
    });
    if (!stock) throw new NotFoundException('Stock not found');
    return this._formatStock(stock);
  }

  async updateStock(
    id: string,
    dto: UpdateStockDto,
    operatorId = 'system',
    operatorName = 'system',
  ) {
    const stock = await this.prisma.stock.findUnique({ where: { id } });
    if (!stock) throw new NotFoundException('Stock not found');

    await this.prisma.$transaction(async (tx) => {
      // 1. Base fields
      await tx.stock.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.shortName !== undefined && { short_name: dto.shortName }),
          ...(dto.barcode !== undefined && { barcode: dto.barcode }),
          ...(dto.stockCategoryId && {
            stock_category_id: dto.stockCategoryId,
          }),
          ...(dto.stockBrandId && { stock_brand_id: dto.stockBrandId }),
          ...(dto.countryId && { country_id: dto.countryId }),
          ...(dto.stockUnitId && { stock_unit_id: dto.stockUnitId }),
          ...(dto.mbflagTypeId && { mbflag_type_id: dto.mbflagTypeId }),
          ...(dto.taxTypeId && { tax_type_id: dto.taxTypeId }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.valid !== undefined && { valid: dto.valid }),
          modify_id: operatorId,
          modify_name: operatorName,
          modify_time: new Date(),
        },
      });

      // 2. Fixed price
      if (dto.fixedPrice !== undefined) {
        await this._upsertPrice(
          tx,
          id,
          'fixed',
          dto.fixedPrice,
          operatorId,
          operatorName,
        );
      }

      // 3. Retail price
      if (dto.retailPrice !== undefined) {
        await this._upsertPrice(
          tx,
          id,
          'retail',
          dto.retailPrice,
          operatorId,
          operatorName,
        );
      }

      // 4. Suppliers (replace all)
      if (dto.partnerId !== undefined) {
        await tx.stock_supplier.deleteMany({ where: { stock_id: id } });
        if (dto.partnerId.length > 0) {
          await tx.stock_supplier.createMany({
            data: dto.partnerId.map((partnerId) => ({
              id: uuidv4(),
              stock_id: id,
              partner_id: partnerId,
              create_id: operatorId,
              create_name: operatorName,
            })),
          });
        }
      }
    });

    return this.getStockById(id);
  }

  async deleteStock(id: string) {
    const stock = await this.prisma.stock.findUnique({ where: { id } });
    if (!stock) throw new NotFoundException('Stock not found');

    // Guard: referenced by purchase_detail or sale_detail
    const [inPurchase, inSale] = await Promise.all([
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::int AS count FROM purchase_detail WHERE stock_id = ${id}
      `,
      this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::int AS count FROM sale_detail WHERE stock_id = ${id}
      `,
    ]);

    if (Number(inPurchase[0].count) > 0)
      throw new ConflictException('此商品已關聯進貨單，無法刪除');
    if (Number(inSale[0].count) > 0)
      throw new ConflictException('此商品已關聯訂單，無法刪除');

    await this.prisma.$transaction(async (tx) => {
      await tx.stock_media.deleteMany({ where: { stock_id: id } });
      await tx.stock_price.deleteMany({ where: { stock_id: id } });
      await tx.stock_supplier.deleteMany({ where: { stock_id: id } });
      await tx.inventory.deleteMany({ where: { stock_id: id } });

      const bom = await tx.stock_bom.findFirst({
        where: { related_stock_id: id },
      });
      if (bom) {
        await tx.stock_bom_detail.deleteMany({
          where: { stock_bom_id: bom.id },
        });
        await tx.stock_bom.delete({ where: { id: bom.id } });
      }

      await tx.stock.delete({ where: { id } });
    });

    return { id, deleted: true };
  }

  // ============================================================
  // STOCK BRAND CRUD
  // ============================================================

  async createStockBrand(
    dto: any,
    operatorId = 'system',
    operatorName = 'system',
  ) {
    const companyId = dto.companyId || 'i2csolution';

    const nameExists = await this.prisma.stock_brand.findFirst({
      where: { company_id: companyId, name: dto.name },
    });
    if (nameExists) throw new ConflictException('品牌名稱已存在');

    const codeExists = await this.prisma.stock_brand.findFirst({
      where: { company_id: companyId, code: dto.code },
    });
    if (codeExists) throw new ConflictException('品牌編號已存在');

    const last = await this.prisma.stock_brand.findFirst({
      where: { company_id: companyId },
      orderBy: { sorting: 'desc' },
    });
    const sorting = last ? Number(last.sorting) + 5 : 1;

    return this.prisma.stock_brand.create({
      data: {
        id: uuidv4(),
        company_id: companyId,
        sorting,
        code: dto.code,
        name: dto.name,
        description: dto.description ?? null,
        create_id: operatorId,
        create_name: operatorName,
      },
    });
  }

  async getStockBrands(companyId = 'i2csolution') {
    return this.prisma.stock_brand.findMany({
      where: { company_id: companyId },
      orderBy: { sorting: 'asc' },
    });
  }

  async getStockBrandById(id: string) {
    const brand = await this.prisma.stock_brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Stock brand not found');
    return brand;
  }

  async updateStockBrand(
    id: string,
    dto: any,
    operatorId = 'system',
    operatorName = 'system',
  ) {
    const brand = await this.prisma.stock_brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Stock brand not found');

    if (dto.name && dto.name !== brand.name) {
      const dup = await this.prisma.stock_brand.findFirst({
        where: { company_id: brand.company_id, name: dto.name, id: { not: id } },
      });
      if (dup) throw new ConflictException('品牌名稱已存在');
    }

    if (dto.code && dto.code !== brand.code) {
      const dup = await this.prisma.stock_brand.findFirst({
        where: { company_id: brand.company_id, code: dto.code, id: { not: id } },
      });
      if (dup) throw new ConflictException('品牌編號已存在');
    }

    return this.prisma.stock_brand.update({
      where: { id },
      data: {
        ...(dto.code && { code: dto.code }),
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        modify_id: operatorId,
        modify_name: operatorName,
        modify_time: new Date(),
      },
    });
  }

  async deleteStockBrand(id: string) {
    const brand = await this.prisma.stock_brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Stock brand not found');

    const inUse = await this.prisma.stock.count({
      where: { stock_brand_id: id },
    });
    if (inUse > 0) throw new ConflictException('此品牌已關聯商品，無法刪除');

    await this.prisma.stock_brand.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ============================================================
  // STOCK CATEGORY CRUD
  // ============================================================

  async createStockCategory(
    dto: any,
    operatorId = 'system',
    operatorName = 'system',
  ) {
    const companyId = dto.companyId || 'i2csolution';

    const existing = await this.prisma.stock_category.findFirst({
      where: { company_id: companyId, name: dto.name },
    });
    if (existing) throw new ConflictException('類別名稱已存在');

    let treeLevel = 1;
    if (dto.parent) {
      const parentCat = await this.prisma.stock_category.findUnique({
        where: { id: dto.parent },
      });
      if (!parentCat) throw new NotFoundException('Parent category not found');
      treeLevel = Number(parentCat.tree_level) + 1;
    }

    return this.prisma.stock_category.create({
      data: {
        id: uuidv4(),
        company_id: companyId,
        parent: dto.parent ?? null,
        tree_level: treeLevel,
        code: dto.code,
        name: dto.name,
        description: dto.description ?? null,
        create_id: operatorId,
        create_name: operatorName,
      },
    });
  }

  async getStockCategories(companyId = 'i2csolution') {
    return this.prisma.stock_category.findMany({
      where: { company_id: companyId },
      orderBy: { code: 'asc' },
      include: {
        // self-relation: parent row
        stock_category: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async getStockCategoryById(id: string) {
    const cat = await this.prisma.stock_category.findUnique({
      where: { id },
      include: {
        // parent row
        stock_category: true,
        // children rows  (Prisma names the reverse side "other_stock_category")
        other_stock_category: true,
      },
    });
    if (!cat) throw new NotFoundException('Stock category not found');
    return cat;
  }

  async updateStockCategory(
    id: string,
    dto: any,
    operatorId = 'system',
    operatorName = 'system',
  ) {
    const cat = await this.prisma.stock_category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Stock category not found');

    if (dto.name && dto.name !== cat.name) {
      const dup = await this.prisma.stock_category.findFirst({
        where: { company_id: cat.company_id, name: dto.name, id: { not: id } },
      });
      if (dup) throw new ConflictException('類別名稱已存在');
    }

    if (dto.code && dto.code !== cat.code) {
      const dup = await this.prisma.stock_category.findFirst({
        where: { company_id: cat.company_id, code: dto.code, id: { not: id } },
      });
      if (dup) throw new ConflictException('類別編號已存在');
    }

    let treeLevel = Number(cat.tree_level);
    if (dto.parent !== undefined && dto.parent !== cat.parent) {
      if (dto.parent) {
        const parentCat = await this.prisma.stock_category.findUnique({
          where: { id: dto.parent },
        });
        if (!parentCat)
          throw new NotFoundException('Parent category not found');
        treeLevel = Number(parentCat.tree_level) + 1;
      } else {
        treeLevel = 1;
      }
    }

    return this.prisma.stock_category.update({
      where: { id },
      data: {
        ...(dto.code && { code: dto.code }),
        ...(dto.name && { name: dto.name }),
        ...(dto.parent !== undefined && { parent: dto.parent ?? null }),
        tree_level: treeLevel,
        ...(dto.description !== undefined && { description: dto.description }),
        modify_id: operatorId,
        modify_name: operatorName,
        modify_time: new Date(),
      },
    });
  }

  async deleteStockCategory(id: string) {
    const cat = await this.prisma.stock_category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Stock category not found');

    const hasChildren = await this.prisma.stock_category.count({
      where: { parent: id },
    });
    if (hasChildren > 0)
      throw new ConflictException('此類別已被其他類別相關聯，無法刪除');

    const inUse = await this.prisma.stock.count({
      where: { stock_category_id: id },
    });
    if (inUse > 0)
      throw new ConflictException('此類別已關聯商品，無法刪除');

    // stock_category_media is not exposed as a top-level Prisma delegate
    // in this introspected schema — delete via raw SQL instead
    await this.prisma.$executeRaw`
      DELETE FROM stock_category_media WHERE stock_category_id = ${id}
    `;
    await this.prisma.stock_category.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ============================================================
  // STOCK UNIT CRUD
  // ============================================================

  async createStockUnit(
    dto: any,
    operatorId = 'system',
    operatorName = 'system',
  ) {
    const existing = await this.prisma.stock_unit.findFirst({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException('單位名稱已存在');

    const last = await this.prisma.stock_unit.findFirst({
      orderBy: { sorting: 'desc' },
    });
    const sorting = last ? Number(last.sorting) + 5 : 1;

    return this.prisma.stock_unit.create({
      data: {
        id: uuidv4(),
        sorting,
        name: dto.name,
        description: dto.description ?? null,
        create_id: operatorId,
        create_name: operatorName,
      },
    });
  }

  async getStockUnits() {
    return this.prisma.stock_unit.findMany({ orderBy: { sorting: 'asc' } });
  }

  async getStockUnitById(id: string) {
    const unit = await this.prisma.stock_unit.findUnique({ where: { id } });
    if (!unit) throw new NotFoundException('Stock unit not found');
    return unit;
  }

  async updateStockUnit(
    id: string,
    dto: any,
    operatorId = 'system',
    operatorName = 'system',
  ) {
    const unit = await this.prisma.stock_unit.findUnique({ where: { id } });
    if (!unit) throw new NotFoundException('Stock unit not found');

    if (dto.name && dto.name !== unit.name) {
      const dup = await this.prisma.stock_unit.findFirst({
        where: { name: dto.name, id: { not: id } },
      });
      if (dup) throw new ConflictException('單位名稱已存在');
    }

    return this.prisma.stock_unit.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        modify_id: operatorId,
        modify_name: operatorName,
        modify_time: new Date(),
      },
    });
  }

  async deleteStockUnit(id: string) {
    const unit = await this.prisma.stock_unit.findUnique({ where: { id } });
    if (!unit) throw new NotFoundException('Stock unit not found');

    const inUse = await this.prisma.stock.count({
      where: { stock_unit_id: id },
    });
    if (inUse > 0) throw new ConflictException('此單位已關聯商品，無法刪除');

    await this.prisma.stock_unit.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ============================================================
  // LOOKUP DATA
  // ============================================================

  async getMbflagTypes() {
    return this.prisma.mbflag_type.findMany({ orderBy: { sorting: 'asc' } });
  }

  async getTaxTypes() {
    return this.prisma.tax_type.findMany({ orderBy: { sorting: 'asc' } });
  }

  async getStockPrices(stockId: string, priceTypeId?: string) {
    const stock = await this.prisma.stock.findUnique({
      where: { id: stockId },
    });
    if (!stock) throw new NotFoundException('Stock not found');

    return this.prisma.stock_price.findMany({
      where: {
        stock_id: stockId,
        ...(priceTypeId && { price_type_id: priceTypeId }),
      },
      orderBy: [
        { price_type_id: 'asc' },
        { effective_date_start: 'desc' },
      ],
    });
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  private _stockIncludes() {
    return {
      // Prisma names relations after the foreign-key table name when
      // there is no explicit @relation name in a hand-crafted schema.
      // After introspection the relation names match the referenced table.
      stock_brand: { select: { id: true, name: true, code: true } },
      stock_category: {
        select: { id: true, name: true, code: true, tree_level: true },
      },
      stock_unit: { select: { id: true, name: true } },
      mbflag_type: { select: { id: true, name: true, code: true } },
      tax_type: { select: { id: true, name: true } },
      stock_supplier: true,
      stock_price: {
        where: { effective_date_end: null },
        orderBy: { price_type_id: 'asc' as const },
      },
      stock_media: { orderBy: { sorting: 'asc' as const } },
    };
  }

  private _formatStock(stock: any) {
    const prices: any[] = stock.stock_price ?? [];
    const fixedPrice = prices.find((p) => p.price_type_id === 'fixed');
    const retailPrice = prices.find((p) => p.price_type_id === 'retail');

    return {
      ...stock,
      fixedPrice: fixedPrice?.price ?? null,
      retailPrice: retailPrice?.price ?? null,
      partnerIds:
        stock.stock_supplier?.map((s: any) => s.partner_id) ?? [],
    };
  }

  private async _upsertPrice(
    tx: any,
    stockId: string,
    priceTypeId: string,
    newPrice: number,
    operatorId: string,
    operatorName: string,
  ) {
    const current = await tx.stock_price.findFirst({
      where: {
        stock_id: stockId,
        price_type_id: priceTypeId,
        effective_date_end: null,
      },
    });

    if (current) {
      if (Number(current.price) === newPrice) return; // no change
      await tx.stock_price.update({
        where: { id: current.id },
        data: { effective_date_end: new Date() },
      });
    }

    const agg = await tx.stock_price.aggregate({
      where: { stock_id: stockId },
      _max: { sorting: true },
    });

    await tx.stock_price.create({
      data: {
        id: uuidv4(),
        stock_id: stockId,
        sorting: (Number(agg._max.sorting) ?? 0) + 1,
        price_type_id: priceTypeId,
        country_id: 'tw',
        currencies_id: 'TWD',
        price: newPrice,
        effective_date_start: new Date(),
        create_id: operatorId,
        create_name: operatorName,
      },
    });
  }
}