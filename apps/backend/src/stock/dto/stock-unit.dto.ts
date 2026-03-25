// ============================================================
// src/stock/dto/stock-unit.dto.ts
// ============================================================

import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockUnitDto {
  @ApiProperty({ description: '單位名稱' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateStockUnitDto {
  @ApiPropertyOptional({ description: '單位名稱' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;
}