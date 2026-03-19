import { IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string; // 可以是 account 或 email

  @IsString()
  @MinLength(6)
  password: string;
}
