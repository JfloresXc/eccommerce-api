import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesMockRepository } from '../../database/mocks/repositories';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CategoriesRepository,
      useClass: CategoriesMockRepository,
    },
  ],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
