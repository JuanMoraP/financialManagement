import { Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  //Admin
  @Get()
  async getAllCategories() {}

  //User
  @Get()
  async getMyCategories() {}

  //user
  @Post('create-categorie')
  async createCategorie() {}
}
