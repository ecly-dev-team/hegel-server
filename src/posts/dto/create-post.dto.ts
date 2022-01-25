import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly abstract: string;

  @IsString()
  readonly content: string;

  @IsString({ each: true })
  @IsOptional()
  readonly tagNames: string[];

  @IsInt()
  @Min(0)
  readonly categoryId: number;
}
