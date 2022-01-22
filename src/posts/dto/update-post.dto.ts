import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  readonly category: number;
}
