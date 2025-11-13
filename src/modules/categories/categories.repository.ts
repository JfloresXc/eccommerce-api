import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { Category } from './entities/category.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

@Injectable()
export class CategoriesRepository implements IRepository<Category> {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  /**
   * Create a new category document in the database.
   * @param data Partial category data to create the document.
   * @returns The persisted Category document.
   */
  async create(data: Partial<Category>): Promise<Category> {
    const category = new this.categoryModel(data);
    return category.save();
  }

  /**
   * Find a category by its MongoDB identifier.
   * @param id The category `_id` as string.
   * @returns The Category document or null if not found.
   */
  async findById(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id).exec();
  }

  /**
   * Find a single category by a filter query.
   * @param filter Mongoose filter to locate a category.
   * @returns The Category document or null if not found.
   */
  async findOne(filter: FilterQuery<Category>): Promise<Category | null> {
    return this.categoryModel.findOne(filter).exec();
  }

  /**
   * Find multiple categories by a filter query.
   * @param filter Mongoose filter to locate categories.
   * @returns Array of Category documents.
   */
  async find(filter: FilterQuery<Category>): Promise<Category[]> {
    return this.categoryModel.find(filter).exec();
  }

  /**
   * Paginate category results using a filter.
   * @param filter Mongoose filter to apply.
   * @param page Page number (1-based).
   * @param limit Items per page.
   * @returns Data and total count for the current page.
   */
  async findWithPagination(
    filter: FilterQuery<Category>,
    page: number,
    limit: number,
  ): Promise<{ data: Category[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.categoryModel.find(filter).skip(skip).limit(limit).exec(),
      this.categoryModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  /**
   * Update a category document by id.
   * @param id Category `_id` as string.
   * @param data Update query with changes.
   * @returns The updated Category document or null if not found.
   */
  async update(
    id: string,
    data: UpdateQuery<Category>,
  ): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Delete a category by id.
   * @param id Category `_id` as string.
   * @returns True if deleted, false otherwise.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
