import { PartialType } from '@nestjs/mapped-types';
import { CreateReclamationDto } from './create-reclamation.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReclamationStatus } from 'src/schemas/reclamation.schema';

export class UpdateReclamationDto {
    @IsOptional()
    @IsString()
    adminComments?: string;

    @IsOptional()
    @IsEnum(ReclamationStatus)
    status?: ReclamationStatus;
}