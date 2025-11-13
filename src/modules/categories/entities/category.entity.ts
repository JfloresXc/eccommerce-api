import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true, index: true, min: 0 })
  id: number;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  icon?: string;

  @Prop()
  image?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
