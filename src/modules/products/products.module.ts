import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsMockRepository } from '../../database/mocks/repositories';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: ProductsRepository,
      useClass: ProductsMockRepository,
    },
  ],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
