import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

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
}
