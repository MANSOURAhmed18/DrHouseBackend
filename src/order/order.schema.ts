import { Schema, Document, Types } from 'mongoose';

export const OrderSchema = new Schema({
  id: { type: String, required: true },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export interface Order extends Document {
  id: string;
  products: { productId: Types.ObjectId; quantity: number }[];
  totalAmount: number;
  status: string;
  createdAt: Date;
}
