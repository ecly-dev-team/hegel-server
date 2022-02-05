import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './enum/role.enum';
import { RequestUser } from 'src/auth/interface/request-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(`user email ${email} not found`);
    }
    return user;
  }

  async findOneByName(name: string) {
    const user = await this.userRepository.findOne({ name });
    if (!user) {
      throw new NotFoundException(`user name ${name} not found`);
    }
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`user id #${id} not found`);
    }
    return user;
  }

  async checkDuplicatedEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      throw new BadRequestException('Duplicated Email');
    }
  }

  async checkDuplicatedName(name: string) {
    const user = await this.userRepository.findOne({ name });
    if (user) {
      throw new BadRequestException('Duplicated Name');
    }
  }

  async create(createUserDto: CreateUserDto) {
    await Promise.all([
      this.checkDuplicatedEmail(createUserDto.email),
      this.checkDuplicatedName(createUserDto.name),
    ]);
    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password,
      role: Role.GUEST,
    });
    let res = await this.userRepository.save(user);
    if (res.id === 1) {
      await this.userRepository.update({ id: 1 }, { role: Role.SUPER_ADMIN });
      res = await this.userRepository.findOne(1);
    }
    delete res.password;
    return res;
  }

  // async assign(assignRoleDto: AssignRoleDto, requestUser: RequestUser) {
  //   if (assignRoleDto.role === Role.SUPER_ADMIN) {
  //     throw new ForbiddenException();
  //   }
  //   if (
  //     assignRoleDto.role === Role.ADMIN &&
  //     requestUser.role !== Role.SUPER_ADMIN
  //   ) {
  //     throw new ForbiddenException();
  //   }
  //   const user = await this.findOneById(assignRoleDto.userId);
  //   user.role = assignRoleDto.role;
  //   const res = await this.userRepository.save(user);
  //   delete res.password;
  //   return res;
  // }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    user = { ...user, ...updateUserDto };
    return this.userRepository.save(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    requestUser: RequestUser,
  ) {
    if (updateUserDto.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('not allowed to assign superadmin');
    }
    const user = await this.findOneById(id);
    if (user.id === id) {
      return this.updateUser(user, updateUserDto);
    }
    if (user.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('not allowed to modify superadmin');
    } else if (user.role === Role.ADMIN) {
      if (updateUserDto.password) {
        // include sensitive information
        if (requestUser.role !== Role.SUPER_ADMIN) {
          throw new ForbiddenException('not allowed to modify admin password');
        }
        return this.updateUser(user, updateUserDto);
      } else {
        // not include sensitive information
        return this.updateUser(user, updateUserDto);
      }
    } else {
      if (updateUserDto.role === Role.ADMIN) {
        // include sensitive information
        if (requestUser.role !== Role.SUPER_ADMIN) {
          throw new ForbiddenException('not allowed to assign admin');
        }
        return this.updateUser(user, updateUserDto);
      } else {
        // not include sensitive information
        return this.updateUser(user, updateUserDto);
      }
    }
  }
}
