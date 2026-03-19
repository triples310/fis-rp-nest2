import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  account: string; // 登入帳號（必填）

  @IsOptional()
  @IsEmail()
  email?: string; // Email（選填）

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string; // 備註（選填）

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
