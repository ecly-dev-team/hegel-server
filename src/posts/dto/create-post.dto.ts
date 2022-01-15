import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly abstract: string;

  @IsString()
  readonly content: string;

  @IsDate()
  readonly createDate: Date;

  @IsDate()
  @IsOptional()
  readonly updateDate: Date;

  @IsString({ each: true })
  @IsOptional()
  readonly tags: string[];
}