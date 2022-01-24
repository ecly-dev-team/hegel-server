import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(username: string) {
    return this.userRepository.findOne({ name: username });
  }

  async create(createUserDto: { name: string; password: string }) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
}
