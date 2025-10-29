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

  async create(data: Partial<Category>): Promise<Category> {
    const category = new this.categoryModel(data);
    return category.save();
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id).exec();
  }

  async findOne(filter: FilterQuery<Category>): Promise<Category | null> {
    return this.categoryModel.findOne(filter).exec();
  }

  async find(filter: FilterQuery<Category>): Promise<Category[]> {
    return this.categoryModel.find(filter).exec();
  }

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

  async update(
    id: string,
    data: UpdateQuery<Category>,
  ): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
