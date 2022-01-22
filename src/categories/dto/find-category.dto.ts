import { IsNumber, Min } from 'class-validator';

export class FindCategoryDto {
  @IsNumber()
  @Min(1)
  id: number;
}
