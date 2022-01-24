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

  @IsDate()
  @IsOptional()
  readonly createDate: Date;

  @IsDate()
  readonly updateDate: Date;

  @IsString({ each: true })
  @IsOptional()
  readonly tags: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly category: number;
}
