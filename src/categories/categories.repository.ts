import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { Repository } from 'typeorm';
import categories from '../utils/categories.json';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async addCategories() {
    try {
      const insertPromises = categories.map((element) =>
        this.categoriesRepository
          .createQueryBuilder()
          .insert()
          .into(Category)
          .values({ name: element.category })
          .orIgnore()
          .execute(),
      );
      await Promise.all(insertPromises);
      return 'Categorias añadidas exitosamente';
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`No fue posible cargar las categorías: ${message}`);
    }
  }
}
