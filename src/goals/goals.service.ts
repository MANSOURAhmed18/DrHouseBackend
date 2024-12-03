import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddGoalDto } from './dto/add-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { User } from '../schemas/user.schema';
import { Goal } from '../schemas/goal.schema';
import { GoalProgress } from '../schemas/goal-progress.schema';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<Goal>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(GoalProgress.name) private progressModel: Model<GoalProgress>,
  ) {}

  async createGoal(userId: string, addGoalDto: AddGoalDto): Promise<Goal> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const goal = new this.goalModel({
      userId: new Types.ObjectId(userId),
      ...addGoalDto,
    });

    const savedGoal = await goal.save();
    
    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { goals: savedGoal._id } }
    );

    return savedGoal;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    const goals = await this.goalModel.find({ userId: new Types.ObjectId(userId) }).exec();
    if (!goals) {
      throw new NotFoundException('No goals found for this user');
    }
    return goals;
  }

  // Fixed duplicate goalId parameter
  async updateGoal(goalId: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.goalModel.findByIdAndUpdate(
      goalId,
      { $set: updateGoalDto },
      { new: true }
    );

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return goal;
  }

  async addProgress(goalId: string, progressDto: UpdateProgressDto): Promise<GoalProgress> {
    const goal = await this.goalModel.findById(goalId);
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const dateStr = progressDto.date;
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
    const date = new Date(Date.UTC(year, month - 1, day));

    let progress = await this.progressModel.findOne({
      goalId: new Types.ObjectId(goalId),
      date: date
    });

    if (!progress) {
      progress = new this.progressModel({
        userId: goal.userId,
        goalId: new Types.ObjectId(goalId),
        date: date,
        steps: 0,
        water: 0,
        sleepHours: 0,
        coffeeCups: 0,
        workout: 0,
        notes: ''
      });
    }

    // Update progress values
    Object.assign(progress, {
      ...progressDto,
      date: date // ensure we use the UTC date
    });

    return await progress.save();
  }

  async getGoalProgress(
    goalId: string,
    startDate?: string,
    endDate?: string
  ): Promise<GoalProgress[]> {
    const query: any = { goalId: new Types.ObjectId(goalId) };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    return this.progressModel
      .find(query)
      .sort({ date: 1 })
      .exec();
  }

  async getTodayProgress(goalId: string): Promise<GoalProgress> {
    const today = new Date();
    const utcToday = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0, 0, 0, 0
    ));

    let progress = await this.progressModel.findOne({
      goalId: new Types.ObjectId(goalId),
      date: {
        $gte: utcToday,
        $lt: new Date(utcToday.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!progress) {
      const goal = await this.goalModel.findById(goalId);
      if (!goal) {
        throw new NotFoundException('Goal not found');
      }

      progress = new this.progressModel({
        userId: goal.userId,
        goalId: new Types.ObjectId(goalId),
        date: utcToday,
        steps: 0,
        water: 0,
        sleepHours: 0,
        coffeeCups: 0,
        workout: 0,
        notes: ''
      });
      await progress.save();
    }

    return progress;
  }
}