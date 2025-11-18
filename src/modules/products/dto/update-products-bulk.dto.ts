import { IsMongoId, IsNotEmpty, IsObject } from 'class-validator';
import { UpdateProductDto } from './update-product.dto';

export class UpdateProductsBulkDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsObject()
  @IsNotEmpty()
  updateProductDto: UpdateProductDto;
}
