import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from 'src/tags/tags.module';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), TagsModule],
  exports: [TypeOrmModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
