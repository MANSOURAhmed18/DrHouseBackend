import { IsString, MinLength } from 'class-validator';

export class VerifyResetDto {
  @IsString()
  resetToken: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
