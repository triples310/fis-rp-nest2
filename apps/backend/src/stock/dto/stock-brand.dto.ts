// ============================================================
// src/stock/dto/stock-brand.dto.ts
// ============================================================
import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockBrandDto {
  @ApiProperty({ description: '品牌編號' })
  @IsString()
  @MinLength(1)
  code: string;

  @ApiProperty({ description: '品牌名稱' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '公司ID' })
  @IsOptional()
  @IsString()
  companyId?: string;
}

export class UpdateStockBrandDto {
  @ApiPropertyOptional({ description: '品牌編號' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: '品牌名稱' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;
}
