// tracking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tracking, TrackingDocument } from 'src/schemas/tracking.schema';
import { CreateTrackingDto } from './dto/tracking.dto';


@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(Tracking.name) private trackingModel: Model<TrackingDocument>
  ) {}

  async create(userId: string, createTrackingDto: CreateTrackingDto) {
    const tracking = new this.trackingModel({
      userId,
      ...createTrackingDto,
    });
    const saved = await tracking.save();
    return saved.compareWithGoal();
  }

  async getDailyTracking(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.trackingModel.findOne({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).exec();
  }
}