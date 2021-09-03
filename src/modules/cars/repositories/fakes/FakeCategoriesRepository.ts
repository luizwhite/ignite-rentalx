import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from '@modules/cars/repositories/ICategoriesRepository';

class FakeCategoriesRepository implements ICategoriesRepository {
  categories: Category[] = [];

  async findByName(name: string): Promise<Category | null> {
    const category = this.categories.find(
      ({ name: catName }) => catName === name
    );

    return category || null;
  }

  async list(): Promise<Category[]> {
    const { categories } = this;

    return categories;
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
    });

    this.categories.push(category);
  }
}

export { FakeCategoriesRepository };
