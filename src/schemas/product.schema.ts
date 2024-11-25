import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, min: 1 })
  price: number;

  @Prop({ default: false })
  requiresPrescription: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1 })
  stock: number;

  @Prop()
  dosage: string;

  @Prop()
  expirationDate: Date;


}

export const ProductSchema = SchemaFactory.createForClass(Product);
