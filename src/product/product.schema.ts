import { Schema, Document } from 'mongoose';

export const ProductSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: false }, // Added image field
  count: { type: Number, required: false, default: 0 }, // Ensure a default value
});

export interface Product extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string; // Optional image attribute
  count?: number;
}
