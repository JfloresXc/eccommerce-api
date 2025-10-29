import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.create(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ isActive: true });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesRepository.update(
      id,
      updateCategoryDto,
    );
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.categoriesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
