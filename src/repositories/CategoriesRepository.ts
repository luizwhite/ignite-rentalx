import { Category } from '../model/Category';

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

class CategoriesRepository {
  private categories: Category[] = [];

  constructor() {
    this.categories = [];
  }

  create: (data: ICreateCategoryDTO) => void = ({ name, description }) => {
    const category = new Category();
    Object.assign(category, {
      name,
      description,
    });

    this.categories.push(category);
  };

  list: () => Category[] = () => this.categories;

  findByName: (name: string) => Category | null = (name) => {
    const category = this.categories.find(
      ({ name: catName }) => catName === name
    );

    return category || null;
  };
}

export { CategoriesRepository };
