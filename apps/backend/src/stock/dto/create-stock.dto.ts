// ============================================================
// src/stock/dto/create-stock.dto.ts
// ============================================================
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateStockDto {
  @ApiProperty({ description: '商品名稱' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '商品簡稱' })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({ description: '商品條碼（國際條碼）' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: '商品編號（系統自動產生可不填）' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: '商品類別ID' })
  @Transform(({ value, obj }) => value ?? obj.stock_category_id)
  @IsString()
  @IsNotEmpty()
  stockCategoryId: string;

  @ApiProperty({ description: '商品品牌ID' })
  @Transform(({ value, obj }) => value ?? obj.stock_brand_id)
  @IsString()
  @IsNotEmpty()
  stockBrandId: string;

  @ApiProperty({ description: '國家ID', example: 'tw' })
  @Transform(({ value, obj }) => value ?? obj.country_id)
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @ApiProperty({ description: '商品單位ID' })
  @Transform(({ value, obj }) => value ?? obj.stock_unit_id)
  @IsString()
  @IsNotEmpty()
  stockUnitId: string;

  @ApiProperty({ description: '供應商ID陣列' })
  @Transform(({ value, obj }) => {
    const raw = value ?? obj.partner_id ?? obj['partner_id[]'];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim().length > 0) return [raw];
    return raw;
  })
  @IsArray()
  @IsString({ each: true })
  partnerId: string[];

  @ApiProperty({ description: '商品屬性 (B=常溫, R=冷藏, F=冷凍, K=組合, A=其他)', example: 'B' })
  @Transform(({ value, obj }) => value ?? obj.mbflag_type_id)
  @IsString()
  mbflagTypeId: string;

  @ApiPropertyOptional({ description: '稅別ID', default: 'tx' })
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.tax_type_id)
  @IsString()
  taxTypeId?: string;

  @ApiPropertyOptional({ description: '定價' })
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.fixed_price)
  @Type(() => Number)
  @IsNumber()
  fixedPrice?: number;

  @ApiPropertyOptional({ description: '零售價' })
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.retail_price)
  @Type(() => Number)
  @IsNumber()
  retailPrice?: number;

  @ApiPropertyOptional({ description: '公司ID' })
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.company_id)
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '是否上架', default: true })
  @IsOptional()
  @IsBoolean()
  valid?: boolean;

  @ApiPropertyOptional({ description: '是否為序號商品', default: false })
  @IsOptional()
  @IsBoolean()
  serialStock?: boolean;

  @ApiPropertyOptional({ description: '是否為寄賣品', default: false })
  @IsOptional()
  @IsBoolean()
  consignment?: boolean;

  @ApiPropertyOptional({ description: '是否為贈品', default: false })
  @IsOptional()
  @IsBoolean()
  gift?: boolean;
}
