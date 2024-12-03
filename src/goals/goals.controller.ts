import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Put,
  Query
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { AddGoalDto } from './dto/add-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Goal } from '../schemas/goal.schema';
import { GoalProgress } from '../schemas/goal-progress.schema';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post('user/:userId')
  async createGoal(
    @Param('userId') userId: string,
    @Body() addGoalDto: AddGoalDto
  ): Promise<Goal> {
    return await this.goalsService.createGoal(userId, addGoalDto);
  }

  @Get('user/:userId')
  async getUserGoals(
    @Param('userId') userId: string
  ): Promise<Goal[]> {
    return await this.goalsService.getUserGoals(userId);
  }

  @Put(':goalId')
  async updateGoal(
    @Param('goalId') goalId: string,
    @Body() updateGoalDto: UpdateGoalDto
  ): Promise<Goal> {
    return await this.goalsService.updateGoal(goalId, updateGoalDto);
  }

  @Post(':goalId/progress')
  async addProgress(
    @Param('goalId') goalId: string,
    @Body() progressDto: UpdateProgressDto
  ): Promise<GoalProgress> {
    return await this.goalsService.addProgress(goalId, progressDto);
  }

  @Get(':goalId/progress/today')
  async getTodayProgress(
    @Param('goalId') goalId: string
  ): Promise<GoalProgress> {
    return await this.goalsService.getTodayProgress(goalId);
  }

  @Get(':goalId/progress')
  async getGoalProgress(
    @Param('goalId') goalId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<GoalProgress[]> {
    return await this.goalsService.getGoalProgress(goalId, startDate, endDate);
  }
} 