import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private tagsService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const tags =
      createPostDto.tags &&
      (await Promise.all(
        createPostDto.tags.map((tag) => this.tagsService.preloadTagByName(tag)),
      ));
    const post = this.postRepository.create({ ...createPostDto, tags });
    return this.postRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const tags =
      updatePostDto.tags &&
      (await Promise.all(
        updatePostDto.tags.map((tag) => this.tagsService.preloadTagByName(tag)),
      ));
    const post = await this.postRepository.preload({
      id,
      ...updatePostDto,
      tags,
    });
    return this.postRepository.save(post);
  }

  findAllForList(paginationQueryDto: PaginationQueryDto): Promise<Post[]> {
    const { limit, offset } = paginationQueryDto;
    return this.postRepository.find({
      order: {
        createDate: 'ASC',
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

  async remove(id: number) {
    const post = await this.findOne(id);
    return this.postRepository.remove(post);
  }

  async getPostCount(): Promise<number> {
    const postsAndCount = await this.postRepository.findAndCount();
    return postsAndCount[1];
  }
}
