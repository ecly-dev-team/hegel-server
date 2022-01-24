import { IsInt, Min } from 'class-validator';

export class FindCategoryDto {
  @IsInt()
  @Min(1)
  id: number;
}
