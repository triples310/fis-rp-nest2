// ============================================================
// src/stock/dto/update-stock.dto.ts
// ============================================================
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class UpdateStockDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.stock_category_id)
  @IsString()
  stockCategoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.stock_brand_id)
  @IsString()
  stockBrandId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.country_id)
  @IsString()
  countryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.stock_unit_id)
  @IsString()
  stockUnitId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.mbflag_type_id)
  @IsString()
  mbflagTypeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.tax_type_id)
  @IsString()
  taxTypeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.fixed_price)
  @Type(() => Number)
  @IsNumber()
  fixedPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value, obj }) => value ?? obj.retail_price)
  @Type(() => Number)
  @IsNumber()
  retailPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  valid?: boolean;
}
