import { IsNumber, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsNumber()
  @Min(0)
  parentId: number;

  @IsString()
  name: string;
}
