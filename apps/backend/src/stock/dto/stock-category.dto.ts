// ============================================================
// src/stock/dto/stock-category.dto.ts
// ============================================================

import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockCategoryDto {
  @ApiProperty({ description: '類別編號' })
  @IsString()
  @MinLength(1)
  code: string;

  @ApiProperty({ description: '類別名稱' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ description: '上層類別ID' })
  @IsOptional()
  @IsString()
  parent?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '公司ID' })
  @IsOptional()
  @IsString()
  companyId?: string;
}

export class UpdateStockCategoryDto {
  @ApiPropertyOptional({ description: '類別編號' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '類別名稱' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '上層類別ID' })
  @IsOptional()
  @IsString()
  parent?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;
}
