import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

class CreateCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}
  // private categoriesRepository: ICategoriesRepository;

  // constructor(categoriesRepository: ICategoriesRepository) {
  //   this.categoriesRepository = categoriesRepository;
  // }

  async execute({ name, description }: IRequest): Promise<void> {
    const categoryFound = await this.categoriesRepository.findByName(name);
    if (categoryFound) throw new Error('Category already exists!');

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
