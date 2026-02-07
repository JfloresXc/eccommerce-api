import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { WishlistRepository } from './wishlist.repository';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ProductsRepository } from '../products/products.repository';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async addToWishlist(userId: string, createWishlistDto: CreateWishlistDto) {
    const { productId } = createWishlistDto;
    const userObjectId = new Types.ObjectId(userId);

    const product = await this.productsRepository.findById(
      productId.toString(),
    );
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const exists = await this.wishlistRepository.existsInWishlist(
      userObjectId,
      productId,
    );
    if (exists) {
      throw new ConflictException('Product already in wishlist');
    }

    return this.wishlistRepository.addToWishlist(userObjectId, productId);
  }

  async getWishlist(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const wishlistItems =
      await this.wishlistRepository.findByUserId(userObjectId);

    const productIds = wishlistItems.map((item) => item.productId);
    const products = await this.productsRepository.find({
      id: { $in: productIds },
    });

    return products;
  }

  async removeFromWishlist(userId: string, productId: number) {
    const userObjectId = new Types.ObjectId(userId);
    const deleted = await this.wishlistRepository.removeFromWishlist(
      userObjectId,
      productId,
    );

    if (!deleted) {
      throw new NotFoundException('Product not found in wishlist');
    }

    return { message: 'Product removed from wishlist' };
  }
}
