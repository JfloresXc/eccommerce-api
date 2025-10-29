import { IsOptional, IsString, IsMongoId } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryProductDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
