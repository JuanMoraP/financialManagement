import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';
import type { Request } from 'express';

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

  @Patch('/updateCategory/:id')
  @UseGuards(AuthGuard)
  async updateCategory(
    @Req() request: Request,
    @Body() updateInfo: UpdateCategoryDto,
    @Param('id', ParseUUIDPipe) categoryId: string,
  ) {
    const userId = request['user'].sub;
    return await this.categoriesService.updateCategory(
      userId,
      categoryId,
      updateInfo,
    );
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
