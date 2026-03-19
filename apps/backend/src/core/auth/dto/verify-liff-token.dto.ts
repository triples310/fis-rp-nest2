import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyLiffTokenDto {
  @IsNotEmpty()
  @IsString()
  liffToken: string;
}
