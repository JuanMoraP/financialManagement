import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  //Admin
  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  //User
  @Get(':id')
  async getMyCategories(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getMyCategories(id);
  }

  //user
  @Post('create-categorie')
  async createCategorie() {}
}
