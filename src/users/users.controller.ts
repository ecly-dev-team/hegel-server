import { Body, Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  registerUser(@Body() registerUserDto: { name: string; password: string }) {
    return this.usersService.create(registerUserDto);
  }
}
