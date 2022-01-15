import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TagsService } from 'src/tags/tags.service';
import { CreatePostDto } from './dto/create-post.dto';
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

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOneForDetail(id);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    await this.postsService.delete(id);
    this.tagsService.removeOrphanedTags();
  }
}
