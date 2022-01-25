import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @Matches(/^[a-zA-Z0-9_-]{4,30}$/, {
    message: 'place your custom message',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
