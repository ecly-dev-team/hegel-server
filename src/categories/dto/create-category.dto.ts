import { IsInt, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsInt()
  @Min(0)
  parentId: number;

  @IsString()
  name: string;
}
