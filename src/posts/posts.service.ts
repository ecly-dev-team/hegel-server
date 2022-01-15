import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  findAllForList(paginationQueryDto: PaginationQueryDto): Promise<Post[]> {
    const { limit, offset } = paginationQueryDto;
    return this.postsRepository.find({
      order: {
        createDate: 'DESC',
      },
      select: ['id', 'title', 'abstract', 'tags', 'createDate'],
      skip: offset,
      take: limit,
    });
  }

  async findOneForDetail(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async delete(id: number) {
    const post = await this.findOneForDetail(id);
    return this.postsRepository.delete(post);
  }
}
