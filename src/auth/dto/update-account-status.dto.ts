// src/auth/dto/update-account-status.dto.ts
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountStatusDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}