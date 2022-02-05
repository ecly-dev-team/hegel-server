import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../enum/role.enum';

export class UpdateUserDto {
  @Matches(/^[a-zA-Z0-9_-]{4,30}$/, {
    message: 'place your custom message',
  })
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
