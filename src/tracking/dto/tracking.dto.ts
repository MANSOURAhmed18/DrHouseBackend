// tracking.dto.ts
import { IsNumber, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateTrackingDto {
  @IsMongoId()
  goalId: string;

  @IsNumber()
  actualSteps: number;

  @IsNumber()
  actualWater: number;

  @IsNumber()
  actualSleepHours: number;

  @IsNumber()
  actualCoffeeCups: number;

  @IsNumber()
  actualWorkout: number;

  @IsString()
  @IsOptional()
  notes?: string;
}