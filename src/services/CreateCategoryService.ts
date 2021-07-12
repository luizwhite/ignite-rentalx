import { CategoriesRepository } from '../repositories/CategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

class CreateCategoryService {
  constructor(private categoriesRepository: CategoriesRepository) {}
  // private categoriesRepository: CategoriesRepository;

  // constructor(categoriesRepository: CategoriesRepository) {
  //   this.categoriesRepository = categoriesRepository;
  // }

  execute: (data: IRequest) => void = ({ name, description }) => {
    const categoryFound = this.categoriesRepository.findByName(name);
    if (categoryFound) throw new Error('Category already exists!');

    this.categoriesRepository.create({ name, description });
  };
}

export { CreateCategoryService };
