// tracking.controller.ts
import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTrackingDto } from './dto/tracking.dto';


@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post(':userId')
  async createTracking(
    @Param('userId') userId: string,
    @Body() createTrackingDto: CreateTrackingDto
  ) {
    return this.trackingService.create(userId, createTrackingDto);
  }

  @Get(':userId/daily')
  async getDailyTracking(
    @Param('userId') userId: string,
    @Query('date') date: string
  ) {
    return this.trackingService.getDailyTracking(
      userId,
      date ? new Date(date) : new Date()
    );
  }
}