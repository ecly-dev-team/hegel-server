import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/enum/role.enum';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  verify(@Request() req) {
    return req.user;
  }

  @Get('test/allow-superadmin-only')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getdata(@Request() req, @Body() testDto) {
    return 233;
  }

  @Get('test/allow-guest-and-superadmin')
  @Roles(Role.GUEST, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getdata2(@Request() req) {
    return req.user;
  }
}
