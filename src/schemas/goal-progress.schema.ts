import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class GoalProgress extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Goal', required: true })
    goalId: Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({ default: 0 })
    steps: number;

    @Prop({ default: 0 })
    water: number;

    @Prop({ default: 0 })
    sleepHours: number;

    @Prop({ default: 0 })
    coffeeCups: number;

    @Prop({ default: 0 })
    workout: number;

    @Prop({ default: '' })
    notes: string;
}

export const GoalProgressSchema = SchemaFactory.createForClass(GoalProgress);