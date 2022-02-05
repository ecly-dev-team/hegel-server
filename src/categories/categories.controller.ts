import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findTrees() {
    return this.categoriesService.findTrees();
  }

  @Get(':id')
  findOne(@Param() params: FindCategoryDto) {
    return this.categoriesService.findChildrenPosts(params.id);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Delete(':id')
  delete(@Param() params: DeleteCategoryDto) {
    return this.categoriesService.delete(params.id);
  }

  @Patch(':id')
  update(@Body() updateCategoryDto: UpdateCategoryDto, @Param('id') id) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
