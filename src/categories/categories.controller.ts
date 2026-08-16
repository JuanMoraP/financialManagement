/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategorieDto } from './dto/create-category.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

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
  @UseGuards(AuthGuard)
  async createCategorie(
    @Body() newCategorie: CreateCategorieDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return await this.categoriesService.createCategorie(userId, newCategorie);
  }
}
