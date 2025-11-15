import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery } from 'mongoose';
import { Product } from './entities/product.entity';
import { IRepository } from '../../common/interfaces/repository.interface';

@Injectable()
export class ProductsRepository implements IRepository<Product> {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  /**
   * Create a new product document in the database.
   * @param data Partial product data to create the document.
   * @returns The persisted Product document.
   */
  async create(data: Partial<Product>): Promise<Product> {
    const product = new this.productModel(data);
    return product.save();
  }

  /**
   * Find a product by its MongoDB identifier.
   * @param id The product `_id` as string.
   * @returns The Product document or null if not found.
   */
  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  /**
   * Find a single product by a filter query.
   * @param filter Mongoose filter to locate a product.
   * @returns The Product document or null if not found.
   */
  async findOne(filter: FilterQuery<Product>): Promise<Product | null> {
    return this.productModel.findOne(filter).exec();
  }

  /**
   * Find multiple products by a filter query.
   * @param filter Mongoose filter to locate products.
   * @returns Array of Product documents.
   */
  async find(filter: FilterQuery<Product>): Promise<Product[]> {
    return this.productModel.find(filter).exec();
  }

  /**
   * Paginate product results using a filter.
   * @param filter Mongoose filter to apply.
   * @param page Page number (1-based).
   * @param limit Items per page.
   * @returns Data and total count for the current page.
   */
  async findWithPagination(
    filter: FilterQuery<Product>,
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  /**
   * Full-text search products by a term using MongoDB text index.
   * @param searchTerm The text to search in indexed fields.
   * @param page Page number (1-based).
   * @param limit Items per page.
   * @returns Data and total count for the search results.
   */
  async findWithSearch(
    searchTerm: string,
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter = {
      $text: { $search: searchTerm },
    };

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter as any)
        .skip(skip)
        .limit(limit)
        .sort({ score: { $meta: 'textScore' } })
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  /**
   * Update a product document by id.
   * @param id Product `_id` as string.
   * @param data Update query with changes.
   * @returns The updated Product document or null if not found.
   */
  async update(
    id: string,
    data: UpdateQuery<Product>,
  ): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  /**
   * Delete a product by id.
   * @param id Product `_id` as string.
   * @returns True if deleted, false otherwise.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Deletes multiple products by their IDs.
   * @param ids An array of product `_id` strings.
   * @returns An object with the count of deleted documents.
   */
  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.productModel
      .deleteMany({ _id: { $in: ids } })
      .exec();
    return { deletedCount: result.deletedCount };
  }
}
