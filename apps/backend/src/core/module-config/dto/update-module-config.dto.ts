import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateModuleConfigDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
