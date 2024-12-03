// goal.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Goal extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  steps: number;

  @Prop({ required: true })
  water: number;

  @Prop({ required: true })
  sleepHours: number;

  @Prop({ required: true })
  coffeeCups: number;

  @Prop({ required: true })
  workout: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);