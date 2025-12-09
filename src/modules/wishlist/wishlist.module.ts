import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { WishlistRepository } from './wishlist.repository';
import { Wishlist, WishlistSchema } from './entities/wishlist.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wishlist.name, schema: WishlistSchema },
    ]),
    ProductsModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService, WishlistRepository],
  exports: [WishlistService, WishlistRepository],
})
export class WishlistModule { }
