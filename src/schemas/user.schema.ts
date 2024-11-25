// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isFirstLogin: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Goal' }] })
  goals: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);