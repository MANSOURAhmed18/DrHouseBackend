import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Goal', required: true })
  goalId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 0 })
  stepsCompleted: number;

  @Prop({ default: 0 })
  waterConsumed: number;

  @Prop({ default: 0 })
  sleepHoursCompleted: number;

  @Prop({ default: 0 })
  coffeeCupsConsumed: number;

  @Prop({ default: 0 })
  workoutMinutes: number;

  @Prop({ default: false })
  completed: boolean;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);