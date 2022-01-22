import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
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
    private categoriesService: CategoriesService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const tags =
      createPostDto.tags &&
      (await Promise.all(
        createPostDto.tags.map((tag) => this.tagsService.preloadTagByName(tag)),
      ));
    const category =
      createPostDto.category === 0
        ? null
        : await this.categoriesService.findOneById(createPostDto.category);
    const post = this.postRepository.create({
      ...createPostDto,
      tags,
      category,
    });
    console.log(post);
    return this.postRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const tags =
      updatePostDto.tags &&
      (await Promise.all(
        updatePostDto.tags.map((tag) => this.tagsService.preloadTagByName(tag)),
      ));
    const category =
      updatePostDto.category === 0
        ? null
        : await this.categoriesService.findOneById(updatePostDto.category);
    const post = await this.postRepository.preload({
      id,
      ...updatePostDto,
      tags,
      category,
    });
    return this.postRepository.save(post);
  }

  async findAllForList(paginationQueryDto: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto;
    const res = await this.postRepository.find({
      order: {
        createDate: 'ASC',
      },
      select: ['id', 'title', 'abstract', 'createDate', 'updateDate'],
      relations: ['tags', 'category'],
      skip: offset,
      take: limit,
    });
    return Promise.all(
      res.map(async (post) => {
        if (post.category) {
          const ancesters = await this.categoriesService.findAncesters(
            post.category,
          );
          return { ...post, category: ancesters };
        } else {
          return post;
        }
      }),
    );
  }

  async findOneForDetail(id: number) {
    const post = await this.postRepository.findOne(id, {
      relations: ['tags', 'category'],
    });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    if (post.category) {
      const ancesters = await this.categoriesService.findAncesters(
        post.category,
      );
      return { ...post, category: ancesters };
    } else {
      return post;
    }
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
