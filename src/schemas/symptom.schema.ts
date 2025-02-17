import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SymptomSearch extends Document {
    @Prop({ required: true, type: [String] })
    symptoms: string[];

    @Prop({ required: true })
    searchCount: number;
}

export const SymptomSearchSchema = SchemaFactory.createForClass(SymptomSearch);