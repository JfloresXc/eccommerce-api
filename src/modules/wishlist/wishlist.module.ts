import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { WishlistRepository } from './wishlist.repository';
import { WishlistMockRepository } from '../../database/mocks/repositories';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    {
      provide: WishlistRepository,
      useClass: WishlistMockRepository,
    },
  ],
  exports: [WishlistService, WishlistRepository],
})
export class WishlistModule {}
