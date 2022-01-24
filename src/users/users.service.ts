import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './enum/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async findOneByName(name: string) {
    return this.userRepository.findOne({ name });
  }

  async checkDuplicatedEmail(email: string) {
    const user = await this.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('Duplicated Email');
    }
  }

  async checkDuplicatedName(name: string) {
    const user = await this.findOneByName(name);
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
}
