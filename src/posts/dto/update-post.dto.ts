import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly abstract: string;

  @IsString()
  @IsOptional()
  readonly content: string;

  @IsString({ each: true })
  @IsOptional()
  readonly tagNames: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly categoryId: number;
}
