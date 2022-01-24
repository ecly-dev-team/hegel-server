import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateConfigDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  postsPerPage: number;
}
