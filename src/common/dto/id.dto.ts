import { IsInt, Min } from 'class-validator';

export class IdDto {
  @IsInt()
  @Min(1)
  id: number;
}
