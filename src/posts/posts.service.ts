import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Tag } from 'src/tags/entities/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private tagsService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const tags = await Promise.all(
      createPostDto.tags.map((tag) => this.tagsService.preloadTagByName(tag)),
    );
    const post = this.postRepository.create({ ...createPostDto, tags });
    return this.postRepository.save(post);
    // const post = this.postRepository.create(createPostDto);
    // return this.postRepository.save(post);
  }

  findAllForList(paginationQueryDto: PaginationQueryDto): Promise<Post[]> {
    const { limit, offset } = paginationQueryDto;
    return this.postRepository.find({
      order: {
        createDate: 'DESC',
      },
      select: ['id', 'title', 'abstract', 'createDate', 'updateDate'],
      relations: ['tags'],
      skip: offset,
      take: limit,
    });
  }

  async findOneForDetail(id: number): Promise<Post> {
    const post = await this.postRepository.findOne(id, {
      relations: ['tags'],
    });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async delete(id: number) {
    const post = await this.findOne(id);
    return this.postRepository.delete(post);
  }
}
