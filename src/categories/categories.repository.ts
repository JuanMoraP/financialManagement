import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { IsNull, Repository } from 'typeorm';
import categories from '../utils/categories.json';
import { CreateCategoryDto } from './dto/create-category.dto';

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

  async getAllCategories() {
    const categories = await this.categoriesRepository.find({
      where: { user: IsNull() },
    });
    if (!categories.length)
      throw new NotFoundException('No se encontraron categorias');

    return categories;
  }

  async getMyCategories(id: string) {
    const categories = await this.getAllCategories();
    const myCategories = await this.categoriesRepository.find({
      where: { user: { id } },
    });
    const allCategories = [...categories, ...myCategories];
    return allCategories;
  }

  async createCategory(userId: string, newCategory: CreateCategoryDto) {
    const categorieExist = await this.categoriesRepository.findOne({
      where: {
        name: newCategory.name,
        user: userId ? { id: userId } : IsNull(),
      },
    });
    if (categorieExist) throw new BadRequestException('La categoria ya existe');

    const createCat = this.categoriesRepository.create({
      name: newCategory.name,
      user: userId ? { id: userId } : null,
    });
    await this.categoriesRepository.save(createCat);
    return 'La categoria ha sido creada correctamente';
  }

  async deleteCategory(userId: string, categoryId: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId, user: { id: userId } },
    });
    if (!category) throw new NotFoundException('Categoria no encontrada');

    await this.categoriesRepository.delete(category.id);
    return 'Categoria eliminada correctamente';
  }
}
