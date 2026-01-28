import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

interface WishlistItem {
  _id: string;
  userId: Types.ObjectId;
  productId: number;
  createdAt: string;
}

@Injectable()
export class WishlistMockRepository {
  private wishlist: WishlistItem[] = [];

  async addToWishlist(userId: Types.ObjectId, productId: number): Promise<any> {
    const wishlistItem: WishlistItem = {
      _id: this.generateId(),
      userId,
      productId,
      createdAt: new Date().toISOString(),
    };
    this.wishlist.push(wishlistItem);
    return wishlistItem;
  }

  async findByUserId(userId: Types.ObjectId): Promise<any[]> {
    return this.wishlist.filter(
      (item) => item.userId.toString() === userId.toString(),
    );
  }

  async removeFromWishlist(
    userId: Types.ObjectId,
    productId: number,
  ): Promise<boolean> {
    const index = this.wishlist.findIndex(
      (item) =>
        item.userId.toString() === userId.toString() &&
        item.productId === productId,
    );
    if (index === -1) return false;

    this.wishlist.splice(index, 1);
    return true;
  }

  async existsInWishlist(
    userId: Types.ObjectId,
    productId: number,
  ): Promise<boolean> {
    return this.wishlist.some(
      (item) =>
        item.userId.toString() === userId.toString() &&
        item.productId === productId,
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
}
