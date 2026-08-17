import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  addCategories() {
    return this.categoriesRepository.addCategories();
  }

  getAllCategories() {
    return this.categoriesRepository.getAllCategories();
  }

  getMyCategories(id: string) {
    return this.categoriesRepository.getMyCategories(id);
  }

  createCategory(userId: string, newCategory: CreateCategoryDto) {
    return this.categoriesRepository.createCategory(userId, newCategory);
  }

  deleteCategory(userId: string, categoryId: string) {
    return this.categoriesRepository.deleteCategory(userId, categoryId);
  }
}
