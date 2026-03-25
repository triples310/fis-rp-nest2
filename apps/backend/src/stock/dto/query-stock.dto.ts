// ============================================================
// src/stock/dto/query-stock.dto.ts
// ============================================================
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryStockDto {
  @ApiPropertyOptional({ description: '商品名稱（模糊搜尋）' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '商品編號' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '條碼' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: '類別ID' })
  @IsOptional()
  @IsString()
  stockCategoryId?: string;

  @ApiPropertyOptional({ description: '品牌ID' })
  @IsOptional()
  @IsString()
  stockBrandId?: string;

  @ApiPropertyOptional({ description: '供應商ID' })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiPropertyOptional({ description: '商品屬性 (B/R/F/K/A)' })
  @IsOptional()
  @IsString()
  mbflagTypeId?: string;

  @ApiPropertyOptional({ description: '分頁 - 頁數', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '分頁 - 每頁筆數', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}