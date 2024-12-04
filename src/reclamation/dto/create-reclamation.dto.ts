import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReclamationStatus } from 'src/schemas/reclamation.schema';

export class CreateReclamationDto {
    @IsNotEmpty()
    @IsString()
    user: string; // User ID

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}


