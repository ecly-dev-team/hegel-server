import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestUser } from 'src/auth/interface/request-user.interface';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TagsService } from 'src/tags/tags.service';
import { Role } from 'src/users/enum/role.enum';
import { UsersService } from 'src/users/users.service';
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
    private usersService: UsersService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    requestUser: RequestUser,
  ): Promise<Post> {
    const tags =
      createPostDto.tagNames &&
      (await Promise.all(
        createPostDto.tagNames.map((tagName) =>
          this.tagsService.preloadTagByName(tagName),
        ),
      ));
    const category =
      createPostDto.categoryId === 0
        ? null
        : await this.categoriesService.findOneById(createPostDto.categoryId);

    const author = await this.usersService.findOneById(requestUser.id);
    const createDate = new Date();
    const post = this.postRepository.create({
      ...createPostDto,
      tags,
      category,
      author,
      createDate,
    });
    const res = await this.postRepository.save(post);
    delete res.author.password;
    return res;
  }

  async authorizationCheck(
    id: number,
    requestUser: RequestUser,
  ): Promise<void> {
    const post = await this.findOneByIdForDetail(id);

    if (
      requestUser.role === Role.ADMIN ||
      requestUser.role === Role.SUPER_ADMIN
    )
      return;

    if (post.author.id === requestUser.id) return;

    throw new ForbiddenException();
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    requestUser: RequestUser,
  ) {
    await this.authorizationCheck(id, requestUser);

    const tags =
      updatePostDto.tagNames &&
      (await Promise.all(
        updatePostDto.tagNames.map((tagName) =>
          this.tagsService.preloadTagByName(tagName),
        ),
      ));

    const category =
      updatePostDto.categoryId === 0
        ? null
        : updatePostDto.categoryId &&
          (await this.categoriesService.findOneById(updatePostDto.categoryId));

    const updateDate = new Date();
    const post = await this.postRepository.preload({
      id,
      ...updatePostDto,
      tags,
      category,
      updateDate,
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
          return { ...post, category: [] };
        }
      }),
    );
  }

  async findOneByIdForDetail(id: number) {
    const post = await this.postRepository.findOne(id, {
      relations: ['tags', 'category', 'author'],
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
      return { ...post, category: [] };
    }
  }

  async findOneById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async remove(id: number, requestUser: RequestUser) {
    await this.authorizationCheck(id, requestUser);

    const post = await this.findOneById(id);
    return this.postRepository.remove(post);
  }

  async getPostCount(): Promise<number> {
    const postsAndCount = await this.postRepository.findAndCount();
    return postsAndCount[1];
  }
}
