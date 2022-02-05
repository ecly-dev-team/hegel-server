import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enum/role.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Post('assign')
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // assign(@Request() req, @Body() assignRoleDto: AssignRoleDto) {
  //   return this.usersService.assign(assignRoleDto, req.user);
  // }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }
}
