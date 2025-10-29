import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/entities/category.entity';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', index: true })
  category: Category;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Create text index for search functionality
ProductSchema.index({ name: 'text', description: 'text' });
