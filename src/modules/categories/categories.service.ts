import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) { }

  /**
   * Create a new category using the provided DTO.
   * @param createCategoryDto Data transfer object with category fields.
   * @returns The created Category document.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.create(createCategoryDto);
  }

  /**
   * Agrega categorías en lote sin validaciones ni upsert.
   * Cada item se intenta crear directamente; si falla, se registra el error.
   * @param categories Arreglo de categorías a agregar.
   * @returns Resumen con creados y errores por item.
   */
  async importBulkCategories(categories: CreateCategoryDto[]): Promise<{ created: number; updated: number; errors: Array<{ item: any; error: string }> }>{
    let created = 0;
    const updated = 0;
    const errors: Array<{ item: any; error: string }> = [];

    for (const item of categories) {
      try {
        await this.categoriesRepository.create(item as any);
        created++;
      } catch (err: any) {
        errors.push({ item, error: err?.message ?? 'Unknown error' });
      }
    }

    return { created, updated, errors };
  }
  /**
   * Retrieve all categories.
   * @returns Array of Category documents.
   */
  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({});
  }

  /**
   * Find a single category by its id.
   * @param id Category `_id` as string.
   * @returns The Category document.
   * @throws NotFoundException if the category does not exist.
   */
  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  /**
   * Update a category by id using the provided DTO.
   * @param id Category `_id` as string.
   * @param updateCategoryDto Partial fields to update.
   * @returns The updated Category document.
   * @throws NotFoundException if the category does not exist.
   */
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

  /**
   * Remove a category by id.
   * @param id Category `_id` as string.
   * @returns void
   * @throws NotFoundException if the category does not exist.
   */
  async remove(id: string): Promise<void> {
    const deleted = await this.categoriesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
