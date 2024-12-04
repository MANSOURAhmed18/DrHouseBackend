// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Prop({ default: true })
    isFirstLogin: boolean;

    @Prop({ default: true })
    isActive: boolean;
    @Prop()
    createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);