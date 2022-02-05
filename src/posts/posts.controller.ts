import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestUser } from 'src/auth/interface/request-user.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IdDto } from 'src/common/dto/id.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { TagsService } from 'src/tags/tags.service';
import { Role } from 'src/users/enum/role.enum';
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
    return this.postsService.findOneByIdForDetail(id);
  }

  @Post()
  @Roles(Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Patch(':id')
  @Roles(Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
    @Param() idDto: IdDto,
  ) {
    return this.postsService.update(idDto.id, updatePostDto, req.user);
  }

  // @Patch(':id')
  // async updatePost(
  //   @Body() updatePostDto: UpdatePostDto,
  //   @Param('id') id: number,
  // ) {
  //   const updatedPost = await this.postsService.update(id, updatePostDto);
  //   this.tagsService.removeOrphanedTags();
  //   return updatedPost;
  // }

  @Delete(':id')
  @Roles(Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletePost(@Request() req, @Param() idDto: IdDto) {
    const res = await this.postsService.remove(idDto.id, req.user);
    this.tagsService.removeOrphanedTags();
    return res;
  }
}
