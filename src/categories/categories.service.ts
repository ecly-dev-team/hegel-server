import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { TreeRepository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: TreeRepository<Category>,
  ) {}

  async findOneById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`category id #${id} not found`);
    }
    return category;
  }

  async findChildrenPosts(id: number): Promise<Post[]> {
    const category = await this.findOneById(id);
    const childrens = await this.categoryRepository.findDescendants(category, {
      relations: ['posts'],
    });
    const posts: Post[] = [];
    childrens.forEach((category) => {
      posts.push(...category.posts);
    });
    return posts;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { parentId, name } = createCategoryDto;
    if (parentId === 0) {
      const category = this.categoryRepository.create({ name });
      return this.categoryRepository.save(category);
    } else {
      const parentCategory = await this.findOneById(parentId);
      const category = this.categoryRepository.create({
        name,
        parent: parentCategory,
      });
      return this.categoryRepository.save(category);
    }
  }

  async delete(id: number) {
    const category = await this.categoryRepository.findOne(id, {
      relations: ['children', 'posts'],
    });
    if (category.children.length) {
      throw new BadRequestException('children is not empty');
    }
    if (category.posts.length) {
      throw new BadRequestException('posts is not empty');
    }
    console.log(category);
    return this.categoryRepository.remove(category);
  }

  findTrees(): Promise<Category[]> {
    return this.categoryRepository.findTrees();
  }

  findAncesters(category: Category): Promise<Category[]> {
    return this.categoryRepository.findAncestors(category);
  }
}
