import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategorieDto } from './dto/create-category.dto';

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

  createCategorie(userId: string, newCategorie: CreateCategorieDto) {
    console.log(newCategorie);
    return this.categoriesRepository.createCategorie(userId, newCategorie);
  }
}
