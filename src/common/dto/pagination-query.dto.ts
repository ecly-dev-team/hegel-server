import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  readonly offset: number;
}
