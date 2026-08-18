/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  //Admin
  @Get('get-all-categories')
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  //User
  @Get('get-my-categories/:id')
  async getMyCategories(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getMyCategories(id);
  }

  //user
  @Post('create-categorie')
  @UseGuards(AuthGuard)
  async createCategorie(
    @Body() newCategorie: CreateCategoryDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return await this.categoriesService.createCategory(userId, newCategorie);
  }

  @Delete('delete-category/:id')
  @UseGuards(AuthGuard)
  async deleteCategory(
    @Req() request: Request,
    @Param('id', ParseUUIDPipe) categoryId: string,
  ) {
    const userId: string = request['user'].sub;
    return this.categoriesService.deleteCategory(userId, categoryId);
  }
}
