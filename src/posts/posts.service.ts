import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  async delete(id: string) {
    try {
      const post = await this.findOne(id);
      return this.postsRepository.delete(post);
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException(`Post #${id} doesn't exist`);
      } else {
        throw new HttpException('Unknown error', 500); // use http error enum please
      }
    }
  }
}
