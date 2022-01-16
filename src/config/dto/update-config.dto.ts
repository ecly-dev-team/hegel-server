import { IsNumber, IsOptional } from 'class-validator';

export class UpdateConfigDto {
  @IsNumber()
  @IsOptional()
  postsPerPage: number;
}
