// goals.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddGoalDto } from './dto/add-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { User } from '../schemas/user.schema';
import { Goal } from '../schemas/goal.schema';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<Goal>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addGoal(userId: string, addGoalDto: AddGoalDto): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const goal = new this.goalModel({
      userId: user._id,
      ...addGoalDto,
    });

    await goal.save();
    user.goals.push(goal._id as Types.ObjectId);
    await user.save();
  }

  async updateGoal(userId: string, goalId: string, updateGoalDto: UpdateGoalDto): Promise<void> {
    const goal = await this.goalModel.findOne({ _id: goalId, userId });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    Object.assign(goal, updateGoalDto);
    await goal.save();
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const user = await this.userModel.findById(userId).populate('goals').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.goals as unknown as Goal[];
  }
}