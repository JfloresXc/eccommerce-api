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
import { QueryProductDto } from './dto/query-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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

  @Get(':id')
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
}
