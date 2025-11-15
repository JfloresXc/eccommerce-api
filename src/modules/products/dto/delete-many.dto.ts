import { IsMongoId, IsArray, ArrayNotEmpty } from 'class-validator';

export class DeleteManyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  ids: string[];
}
