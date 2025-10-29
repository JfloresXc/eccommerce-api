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

  async create(data: Partial<Product>): Promise<Product> {
    const product = new this.productModel(data);
    return product.save();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).populate('category').exec();
  }

  async findOne(filter: FilterQuery<Product>): Promise<Product | null> {
    return this.productModel.findOne(filter).populate('category').exec();
  }

  async find(filter: FilterQuery<Product>): Promise<Product[]> {
    return this.productModel.find(filter).populate('category').exec();
  }

  async findWithPagination(
    filter: FilterQuery<Product>,
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findWithSearch(
    searchTerm: string,
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter = {
      $text: { $search: searchTerm },
      isActive: true,
    };

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('category')
        .skip(skip)
        .limit(limit)
        .sort({ score: { $meta: 'textScore' } })
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async update(
    id: string,
    data: UpdateQuery<Product>,
  ): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('category')
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
