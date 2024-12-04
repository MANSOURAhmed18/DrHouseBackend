// src/schemas/reclamation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ReclamationStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Reclamation extends Document {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId; // Reference to the user who made the reclamation

    @Prop({ required: true })
    title: string; // A short title for the reclamation

    @Prop({ required: true })
    description: string; // Detailed description of the reclamation

    @Prop({ type: String, enum: ReclamationStatus, default: ReclamationStatus.PENDING })
    status: ReclamationStatus; // Status of the reclamation

    @Prop()
    adminComments?: string; // Optional comments from an admin

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: null })
    resolvedAt?: Date; // Optional resolution date
}

export const ReclamationSchema = SchemaFactory.createForClass(Reclamation);
