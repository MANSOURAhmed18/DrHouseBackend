import { IsOptional, IsNumber, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProgressDto {
    @IsDateString()
    date: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    steps?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    water?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    sleepHours?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    coffeeCups?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    workout?: number;

    @IsOptional()
    @IsString()
    notes?: string;
}