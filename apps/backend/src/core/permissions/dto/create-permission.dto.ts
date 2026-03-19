import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @MinLength(2)
  code: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  module: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  description?: string;
}
