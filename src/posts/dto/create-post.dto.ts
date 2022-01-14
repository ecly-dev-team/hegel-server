import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly abstract: string;

  @IsString()
  readonly content: string;
}
