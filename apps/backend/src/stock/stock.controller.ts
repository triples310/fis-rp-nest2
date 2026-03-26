import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { QueryStockDto } from './dto/query-stock.dto';
import {
  CreateStockBrandDto,
  UpdateStockBrandDto,
} from './dto/stock-brand.dto';
import {
  CreateStockCategoryDto,
  UpdateStockCategoryDto,
} from './dto/stock-category.dto';
import {
  CreateStockUnitDto,
  UpdateStockUnitDto,
} from './dto/stock-unit.dto';
import { JwtAuthGuard } from '@core/auth/guards';
import { PermissionGuard } from '@shared/guards';
import { RequirePermission, CurrentUser } from '@shared/decorators';

@ApiTags('Stock')
@ApiBearerAuth('JWT-auth')
@Controller('stock')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  // ============================================================
  // STOCK
  // ============================================================

  @ApiOperation({ summary: '建立商品' })
  @ApiResponse({ status: 201, description: '建立成功' })
  @ApiResponse({ status: 409, description: '商品已存在' })
  @RequirePermission('stock.create')
  @Post()
  async createStock(@Body() dto: CreateStockDto, @CurrentUser() user: any) {
    return this.stockService.createStock(dto, user?.account, user?.name);
  }

  @ApiOperation({ summary: '查詢商品列表' })
  @ApiResponse({ status: 200, description: '成功' })
  @RequirePermission('stock.view')
  @Get()
  async getStocks(@Query() query: QueryStockDto) {
    return this.stockService.getStocks(query);
  }

  @ApiOperation({ summary: '取得單一商品' })
  @ApiResponse({ status: 200, description: '成功' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  @RequirePermission('stock.view')
  @Get(':id')
  async getStock(@Param('id') id: string) {
    return this.stockService.getStockById(id);
  }

  @ApiOperation({ summary: '更新商品' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  @RequirePermission('stock.edit')
  @Patch(':id')
  async updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateStockDto,
    @CurrentUser() user: any,
  ) {
    return this.stockService.updateStock(id, dto, user?.account, user?.name);
  }

  @ApiOperation({ summary: '刪除商品' })
  @ApiResponse({ status: 200, description: '刪除成功' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  @ApiResponse({ status: 409, description: '商品已關聯，無法刪除' })
  @RequirePermission('stock.delete')
  @Delete(':id')
  async deleteStock(@Param('id') id: string) {
    return this.stockService.deleteStock(id);
  }

  @ApiOperation({ summary: '取得商品價格歷史' })
  @RequirePermission('stock.view')
  @Get(':id/prices')
  async getStockPrices(
    @Param('id') id: string,
    @Query('type') type?: string,
  ) {
    return this.stockService.getStockPrices(id, type);
  }

  // ============================================================
  // STOCK BRAND
  // ============================================================

  @ApiOperation({ summary: '建立商品品牌' })
  @RequirePermission('stock.create')
  @Post('brands')
  async createBrand(
    @Body() dto: CreateStockBrandDto,
    @CurrentUser() user: any,
  ) {
    return this.stockService.createStockBrand(dto, user?.account, user?.name);
  }

  @ApiOperation({ summary: '查詢商品品牌列表' })
  @RequirePermission('stock.view')
  @Get('brands/list')
  async getBrands(@Query('companyId') companyId?: string) {
    return this.stockService.getStockBrands(companyId);
  }

  @ApiOperation({ summary: '取得單一品牌' })
  @RequirePermission('stock.view')
  @Get('brands/:id')
  async getBrand(@Param('id') id: string) {
    return this.stockService.getStockBrandById(id);
  }

  @ApiOperation({ summary: '更新商品品牌' })
  @RequirePermission('stock.edit')
  @Patch('brands/:id')
  async updateBrand(
    @Param('id') id: string,
    @Body() dto: UpdateStockBrandDto,
    @CurrentUser() user: any,
  ) {
    return this.stockService.updateStockBrand(id, dto, user?.account, user?.name);
  }

  @ApiOperation({ summary: '刪除商品品牌' })
  @RequirePermission('stock.delete')
  @Delete('brands/:id')
  async deleteBrand(@Param('id') id: string) {
    return this.stockService.deleteStockBrand(id);
  }

  // ============================================================
  // STOCK CATEGORY
  // ============================================================

  @ApiOperation({ summary: '建立商品類別' })
  @RequirePermission('stock.create')
  @Post('categories')
  async createCategory(
    @Body() dto: CreateStockCategoryDto,
    @CurrentUser() user: any,
  ) {
    return this.stockService.createStockCategory(dto, user?.account, user?.name);
  }

  @ApiOperation({ summary: '查詢商品類別列表' })
  @RequirePermission('stock.view')
  @Get('categories/list')
  async getCategories(@Query('companyId') companyId?: string) {
    return this.stockService.getStockCategories(companyId);
  }

  @ApiOperation({ summary: '取得單一類別' })
  @RequirePermission('stock.view')
  @Get('categories/:id')
  async getCategory(@Param('id') id: string) {
    return this.stockService.getStockCategoryById(id);
  }

  @ApiOperation({ summary: '更新商品類別' })
  @RequirePermission('stock.edit')
  @Patch('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateStockCategoryDto,
    @CurrentUser() user: any,
  ) {
    return this.stockService.updateStockCategory(id, dto, user?.account, user?.name);
  }

  @ApiOperation({ summary: '刪除商品類別' })
  @RequirePermission('stock.delete')
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.stockService.deleteStockCategory(id);
  }

  // ============================================================
  // STOCK UNIT
  // ============================================================

  @ApiOperation({ summary: '建立商品單位' })
  @RequirePermission('stock.create')
  @Post('units')
  async createUnit(
    @Body() dto: CreateStockUnitDto,
    @CurrentUser() user: any,
  ) {
    return this.stockService.createStockUnit(dto, user?.account, user?.name);
  }

  @ApiOperation({ summary: '查詢商品單位列表' })
  @RequirePermission('stock.view')
  @Get('units/list')
  async getUnits() {
    return this.stockService.getStockUnits();
  }

  @ApiOperation({ summary: '取得單一商品單位' })
  @RequirePermission('stock.view')
  @Get('units/:id')
  async getUnit(@Param('id') id: string) {
    return this.stockService.getStockUnitById(id);
  }

  @ApiOperation({ summary: '更新商品單位' })
  @RequirePermission('stock.edit')
  @Patch('units/:id')
  async updateUnit(
    @Param('id') id: string,
    @Body() dto: UpdateStockUnitDto,
    @CurrentUser() user: any,
  ) {
    return this.stockService.updateStockUnit(id, dto, user?.account, user?.name);
  }

  @ApiOperation({ summary: '刪除商品單位' })
  @RequirePermission('stock.delete')
  @Delete('units/:id')
  async deleteUnit(@Param('id') id: string) {
    return this.stockService.deleteStockUnit(id);
  }

  // ============================================================
  // LOOKUP DATA
  // ============================================================

  @ApiOperation({ summary: '取得商品屬性列表 (溫層)' })
  @RequirePermission('stock.view')
  @Get('lookup/mbflag-types')
  async getMbflagTypes() {
    return this.stockService.getMbflagTypes();
  }

  @ApiOperation({ summary: '取得稅別列表' })
  @RequirePermission('stock.view')
  @Get('lookup/tax-types')
  async getTaxTypes() {
    return this.stockService.getTaxTypes();
  }
}