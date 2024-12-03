import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from 'src/schemas/progress.schema';

@Controller('progress')

export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  async trackProgress(
    @Body('userId') userId: string,
    @Body() progressData: Partial<Progress>,
  ) {
    return this.progressService.trackProgress(userId, progressData);
  }
  

  @Get(':userId/history')
  async getProgressHistory(
    @Param('userId') userId: string,
    @Query('days') days: number,
  ) {
    return this.progressService.getProgressHistory(userId, days);
  }

  @Get(':userId/stats')
  async getProgressStats(
    @Param('userId') userId: string,
    @Query('days') days: number,
  ) {
    return this.progressService.getProgressStats(userId, days);
  }
}