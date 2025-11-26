import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Agrega un arreglo de categorías sin validaciones ni upsert.
   * Este endpoint acepta un array libre para evitar el ValidationPipe.
   * @param categories Arreglo de objetos categoría (id, name, slug, ...).
   * @returns Resumen de creados y errores.
   */
  @Post('bulk')
  importBulk(@Body() categories: any[]) {
    return this.categoriesService.importBulkCategories(categories as any);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Post('feature-random')
  featureRandom() {
    return this.categoriesService.featureRandomCategories();
  }
}
