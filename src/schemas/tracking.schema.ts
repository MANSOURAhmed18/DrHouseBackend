// tracking.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Goal } from './goal.schema';

export interface TrackingDocument extends Document {
  compareWithGoal(): Promise<{
    stepsAchieved: boolean;
    waterAchieved: boolean;
    sleepAchieved: boolean;
    coffeeWithinLimit: boolean;
    workoutAchieved: boolean;
  }>;
}

@Schema()
export class Tracking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Goal', required: true })
  goalId: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ required: true })
  actualSteps: number;

  @Prop({ required: true })
  actualWater: number;

  @Prop({ required: true })
  actualSleepHours: number;

  @Prop({ required: true })
  actualCoffeeCups: number;

  @Prop({ required: true })
  actualWorkout: number;

  @Prop()
  notes: string;
}

export const TrackingSchema = SchemaFactory.createForClass(Tracking);

TrackingSchema.methods.compareWithGoal = async function() {
  const goal = await this.model('Goal').findById(this.goalId).lean().exec() as Goal;
  if (!goal) throw new Error('Goal not found');
  return {
    stepsAchieved: this.actualSteps >= goal.steps,
    waterAchieved: this.actualWater >= goal.water,
    sleepAchieved: this.actualSleepHours >= goal.sleepHours,
    coffeeWithinLimit: this.actualCoffeeCups <= goal.coffeeCups,
    workoutAchieved: this.actualWorkout >= goal.workout
  };
};