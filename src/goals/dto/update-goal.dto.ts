
import { IsOptional } from 'class-validator';

export class UpdateGoalDto {
    @IsOptional()
    steps?: number;

    @IsOptional()
    water?: number;

    @IsOptional()
    sleepHours?: number;

    @IsOptional()
    coffeeCups?: number;

    @IsOptional()
    workout?: number;
}