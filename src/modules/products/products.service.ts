import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Product } from './entities/product.entity';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.create(createProductDto as any);
  }

  async findAll(
    queryProductDto: QueryProductDto,
  ): Promise<PaginatedResponseDto<Product>> {
    const { page = 1, limit = 10, category, search } = queryProductDto;

    let result: { data: Product[]; total: number };

    if (search) {
      result = await this.productsRepository.findWithSearch(
        search,
        page,
        limit,
      );
    } else {
      const filter: FilterQuery<Product> = { isActive: true };

      if (category) {
        filter.category = category;
      }

      result = await this.productsRepository.findWithPagination(
        filter,
        page,
        limit,
      );
    }

    return new PaginatedResponseDto(result.data, result.total, page, limit);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.update(id, updateProductDto);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.productsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
