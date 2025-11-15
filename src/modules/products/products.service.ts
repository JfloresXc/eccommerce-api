import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteManyDto } from './dto/delete-many.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Product } from './entities/product.entity';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) { }

  /**
   * Create a new product using the provided DTO.
   * @param createProductDto Data transfer object with product fields.
   * @returns The created Product document.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productsRepository.create(createProductDto as any);
  }

  /**
   * Agrega productos en lote sin validaciones ni upsert.
   * Cada item se intenta crear directamente; si falla, se registra el error.
   * @param products Arreglo de productos a agregar.
   * @returns Resumen con creados y errores por item.
   */
  async importBulkProducts(products: CreateProductDto[]): Promise<{ created: number; updated: number; errors: Array<{ item: any; error: string }> }>{
    let created = 0;
    const updated = 0;
    const errors: Array<{ item: any; error: string }> = [];

    for (const item of products) {
      try {
        await this.productsRepository.create(item as any);
        created++;
      } catch (err: any) {
        errors.push({ item, error: err?.message ?? 'Unknown error' });
      }
    }

    return { created, updated, errors };
  }
  /**
   * Retrieve products with optional pagination, category filters, or full-text search.
   * @param queryProductDto Contains page, limit, category, categoryId, and search term.
   * @returns Paginated response containing Product documents.
   */
  async findAll(
    queryProductDto: QueryProductDto,
  ): Promise<PaginatedResponseDto<Product>> {
    const { page = 1, limit = 10, category, categoryId, search } = queryProductDto;

    let result: { data: Product[]; total: number };

    if (search) {
      result = await this.productsRepository.findWithSearch(
        search,
        page,
        limit,
      );
    } else {
      const filter: FilterQuery<Product> = {};

      if (category) {
        (filter as any).category = category;
      }

      if (typeof categoryId === 'number') {
        (filter as any).categoryId = categoryId;
      }

      result = await this.productsRepository.findWithPagination(
        filter,
        page,
        limit,
      );
    }

    return new PaginatedResponseDto(result.data, result.total, page, limit);
  }

  /**
   * Find a single product by its id.
   * @param id Product `_id` as string.
   * @returns The Product document.
   * @throws NotFoundException if the product does not exist.
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Update a product by id using the provided DTO.
   * @param id Product `_id` as string.
   * @param updateProductDto Partial fields to update.
   * @returns The updated Product document.
   * @throws NotFoundException if the product does not exist.
   */
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

  /**
   * Remove a product by id.
   * @param id Product `_id` as string.
   * @returns void
   * @throws NotFoundException if the product does not exist.
   */
  async remove(id: string): Promise<void> {
    const deleted = await this.productsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  /**
   * Removes multiple products by their IDs.
   * @param deleteManyDto DTO containing an array of product IDs to delete.
   * @returns An object with the count of deleted documents.
   */
  async removeMany(
    deleteManyDto: DeleteManyDto,
  ): Promise<{ deletedCount: number }> {
    return this.productsRepository.deleteMany(deleteManyDto.ids);
  }
}
