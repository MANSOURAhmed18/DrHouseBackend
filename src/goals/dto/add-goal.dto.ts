import { IsInt, IsPositive } from 'class-validator';

export class AddGoalDto {
  @IsInt()
  @IsPositive()
  steps: number;

  @IsInt()
  @IsPositive()
  water: number;

  @IsInt()
  @IsPositive()
  sleepHours: number;

  @IsInt()
  @IsPositive()
  coffeeCups: number;

  @IsInt()
  @IsPositive()
  workout: number;
}