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
  @IsString()
  @IsNotEmpty()
  stockCategoryId: string;

  @ApiProperty({ description: '商品品牌ID' })
  @IsString()
  @IsNotEmpty()
  stockBrandId: string;

  @ApiProperty({ description: '國家ID', example: 'tw' })
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @ApiProperty({ description: '商品單位ID' })
  @IsString()
  @IsNotEmpty()
  stockUnitId: string;

  @ApiProperty({ description: '供應商ID陣列' })
  @IsArray()
  @IsString({ each: true })
  partnerId: string[];

  @ApiProperty({ description: '商品屬性 (B=常溫, R=冷藏, F=冷凍, K=組合, A=其他)', example: 'B' })
  @IsString()
  mbflagTypeId: string;

  @ApiPropertyOptional({ description: '稅別ID', default: 'tx' })
  @IsOptional()
  @IsString()
  taxTypeId?: string;

  @ApiPropertyOptional({ description: '定價' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fixedPrice?: number;

  @ApiPropertyOptional({ description: '零售價' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  retailPrice?: number;

  @ApiPropertyOptional({ description: '公司ID' })
  @IsOptional()
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