// goals.controller.ts
import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { AddGoalDto } from './dto/add-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from 'src/schemas/goal.schema';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post(':userId')
  async addGoal(@Param('userId') userId: string, @Body() addGoalDto: AddGoalDto): Promise<void> {
    await this.goalsService.addGoal(userId, addGoalDto);
  }

  @Put(':userId/:goalId')
  async updateGoal(@Param('userId') userId: string, @Param('goalId') goalId: string, @Body() updateGoalDto: UpdateGoalDto): Promise<void> {
    await this.goalsService.updateGoal(userId, goalId, updateGoalDto);
  }

  @Get(':userId')
  async getGoals(@Param('userId') userId: string): Promise<Goal[]> {
    return this.goalsService.getGoals(userId);
  }
}