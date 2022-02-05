import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async preloadTagByName(tagName: string): Promise<Tag> {
    if (tagName === '') {
      throw new BadRequestException(`Tag name should not be empty`);
    }
    const tag = await this.tagRepository.findOne({ name: tagName });
    if (tag) {
      return tag;
    }
    return this.tagRepository.create({ name: tagName });
  }

  create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    const tags = await this.tagRepository.find({
      order: { name: 'ASC' },
    });
    return tags;
  }

  async findOneForDetail(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne(id, { relations: ['posts'] });
    if (!tag) throw new NotFoundException(`Tag #${id} not found`);
    return tag;
  }

  async removeOrphanedTags(): Promise<void> {
    const tags = await this.tagRepository.find({ relations: ['posts'] });

    await Promise.all(
      tags.map((tag) => {
        if (tag.posts.length === 0) {
          return this.tagRepository.delete(tag.id);
        }
      }),
    );
  }
}
