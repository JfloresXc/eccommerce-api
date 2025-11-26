import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteManyDto } from './dto/delete-many.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductsBulkDto } from './dto/update-products-bulk.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * Agrega un arreglo de productos sin validaciones ni upsert.
   * @param products Arreglo de productos.
   * @returns Resumen de creados y errores.
   */
  @Post('bulk')
  importBulk(@Body() products: CreateProductDto[]) {
    return this.productsService.importBulkProducts(products);
  }

  @Get()
  findAll(@Query() queryProductDto: QueryProductDto) {
    return this.productsService.findAll(queryProductDto);
  }

  @Get('featured')
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get('/detail/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  /**
   * Deletes multiple products by their IDs.
   * @param deleteManyDto DTO containing an array of product IDs to delete.
   * @returns An object with the count of deleted documents.
   */
  @Delete('bulk/delete')
  removeMany(@Body() deleteManyDto: DeleteManyDto) {
    return this.productsService.removeMany(deleteManyDto);
  }

  /**
   * Updates multiple products in bulk.
   * @param updateProductsBulkDto An array of DTOs with product IDs and update data.
   * @returns An object with the count of modified documents.
   */
  @Patch('bulk/update')
  updateBulk(@Body() updateProductsBulkDto: UpdateProductsBulkDto[]) {
    return this.productsService.updateBulk(updateProductsBulkDto);
  }

  @Post('addPriceBefore')
  addPriceBefore() {
    return this.productsService.addPriceBefore();
  }
}
