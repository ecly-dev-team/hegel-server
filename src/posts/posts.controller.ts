import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TagsService } from 'src/tags/tags.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly tagsService: TagsService,
  ) {}

  @Get()
  findAllForList(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.postsService.findAllForList(paginationQueryDto);
  }

  // optimizable
  @Get('count')
  async getPostCount() {
    return { count: await this.postsService.getPostCount() };
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOneForDetail(id);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Patch(':id')
  updatePost(@Body() updatePostDto: UpdatePostDto, @Param('id') id: number) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    await this.postsService.remove(id);
    this.tagsService.removeOrphanedTags();
  }
}
