import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true, index: true, min: 0 })
  id: number;

  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  priceBefore?: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, min: 0 })
  categoryId: number;

  @Prop({ required: true })
  image: string;

  @Prop({ min: 0, default: 0 })
  discount?: number;

  @Prop({ min: 0, default: 0 })
  rating?: number;

  @Prop({ default: false })
  featured?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Create text index for search functionality
ProductSchema.index({ name: 'text', description: 'text' });
