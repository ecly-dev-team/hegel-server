import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { RequestUser } from '../interface/request-user.interface';

@Injectable()
export class RolesGuard {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    let user = context.switchToHttp().getRequest().user as RequestUser;

    const { role, name } = await this.usersService.findOneById(user.id);
    user = { ...user, role, name };

    console.log('Request User:', user);
    context.switchToHttp().getRequest().user = user;

    return roles.includes(user.role);
  }
}
