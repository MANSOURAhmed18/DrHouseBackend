import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal } from 'src/schemas/goal.schema';
import { Progress } from 'src/schemas/progress.schema';


@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    @InjectModel(Goal.name) private goalModel: Model<Goal>,
  ) {}

  async trackProgress(userId: string, progressData: Partial<Progress>) {
    const goal = await this.goalModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!goal) {
      throw new Error('No goals found for user');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingProgress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingProgress) {
      // Update existing progress
      const updatedProgress = await this.progressModel.findByIdAndUpdate(
        existingProgress._id,
        {
          ...progressData,
          goalsMet: this.checkGoalsMet(progressData, goal),
        },
        { new: true },
      );
      return updatedProgress;
    }

    // Create new progress entry
    const newProgress = new this.progressModel({
      userId: new Types.ObjectId(userId),
      goalId: goal._id,
      date: today,
      ...progressData,
      goalsMet: this.checkGoalsMet(progressData, goal),
    });

    return newProgress.save();
  }

  private checkGoalsMet(progress: Partial<Progress>, goal: Goal): boolean {
    return (
      (progress.stepsCompleted ?? 0) >= goal.steps &&
      (progress.waterConsumed ?? 0) >= goal.water &&
      (progress.sleepHoursCompleted ?? 0) >= goal.sleepHours &&
      (progress.coffeeCupsConsumed ?? 0) <= goal.coffeeCups &&
      (progress.workoutMinutes ?? 0) >= goal.workout
    );
  }

  async getProgressHistory(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return this.progressModel
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: startDate },
      })
      .sort({ date: 1 }).then(data=>{
        return data.map((data:any) => {
          return {
            ...data,
            date: data.date.toISOString().split('T')[0]+"",
          
          };
        });
      });
  }

  async getProgressStats(userId: string, days: number = 7) {
    const history = await this.getProgressHistory(userId, days);
    
    return {
      totalDays: history.length,
      goalsMetCount: history.filter(p => p.completed).length,
      averages: {
        steps: this.calculateAverage(history, 'stepsCompleted'),
        water: this.calculateAverage(history, 'waterConsumed'),
        sleep: this.calculateAverage(history, 'sleepHoursCompleted'),
        coffee: this.calculateAverage(history, 'coffeeCupsConsumed'),
        workout: this.calculateAverage(history, 'workoutMinutes')
      }
    };
  }

  private calculateAverage(history: Progress[], field: keyof Progress): number {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, curr) => acc + (curr[field] as number || 0), 0);
    return Number((sum / history.length).toFixed(2));
  }
}