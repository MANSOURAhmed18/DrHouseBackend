// src/auth/dto/signupdto.dto.ts
import { IsEmail, IsString, Matches, MinLength, IsEnum, IsOptional } from "class-validator"
import { UserRole } from "../../schemas/user.schema";

export class SignupDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(10, { message: 'password must not be less than 10 characters' })
    @Matches(/^(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, { message: 'password must contain at least one number' })
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}