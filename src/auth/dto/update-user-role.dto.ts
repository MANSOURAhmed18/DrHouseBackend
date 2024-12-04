// src/auth/dto/update-role.dto.ts
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../schemas/user.schema';

export class UpdateUserRoleDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
}