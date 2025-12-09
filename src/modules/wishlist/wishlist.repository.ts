import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './entities/wishlist.entity';

@Injectable()
export class WishlistRepository {
  constructor(
    @InjectModel(Wishlist.name)
    private wishlistModel: Model<WishlistDocument>,
  ) {}

  async addToWishlist(
    userId: Types.ObjectId,
    productId: number,
  ): Promise<Wishlist> {
    const wishlistItem = new this.wishlistModel({ userId, productId });
    return wishlistItem.save();
  }

  async findByUserId(userId: Types.ObjectId): Promise<Wishlist[]> {
    return this.wishlistModel.find({ userId }).exec();
  }

  async removeFromWishlist(
    userId: Types.ObjectId,
    productId: number,
  ): Promise<boolean> {
    const result = await this.wishlistModel
      .findOneAndDelete({ userId, productId })
      .exec();
    return !!result;
  }

  async existsInWishlist(
    userId: Types.ObjectId,
    productId: number,
  ): Promise<boolean> {
    const count = await this.wishlistModel
      .countDocuments({ userId, productId })
      .exec();
    return count > 0;
  }
}
