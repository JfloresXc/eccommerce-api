import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Number, index: true })
  productId: number;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

// Índice compuesto único para evitar duplicados
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });
