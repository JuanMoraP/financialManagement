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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';
import type { Request } from 'express';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('get-all-categories')
  @ApiOperation({ summary: 'Obtener todas las categorías disponibles' })
  @ApiResponse({ status: 200, description: 'Listado de categorías.' })
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get('get-my-categories/:id')
  @ApiOperation({ summary: 'Obtener categorías del usuario por su id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Categorías del usuario.' })
  async getMyCategories(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getMyCategories(id);
  }

  @Post('create-categorie')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear una nueva categoría para el usuario autenticado',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente.' })
  async createCategorie(
    @Body() newCategorie: CreateCategoryDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].sub;
    return await this.categoriesService.createCategory(userId, newCategorie);
  }

  @Patch('/updateCategory/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una categoría del usuario' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Categoría actualizada.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una categoría del usuario' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada.' })
  async deleteCategory(
    @Req() request: Request,
    @Param('id', ParseUUIDPipe) categoryId: string,
  ) {
    const userId: string = request['user'].sub;
    return this.categoriesService.deleteCategory(userId, categoryId);
  }
}
