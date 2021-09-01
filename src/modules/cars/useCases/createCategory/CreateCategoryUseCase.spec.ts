import { AppError } from '../../../../errors/AppError';
import { FakeCategoriesRepository } from '../../repositories/fakes/FakeCategoriesRepository';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let fakeCategoriesRepository: FakeCategoriesRepository;

describe('Create category', () => {
  beforeEach(() => {
    fakeCategoriesRepository = new FakeCategoriesRepository();
    createCategoryUseCase = new CreateCategoryUseCase(fakeCategoriesRepository);
  });

  it('should be able to create a new category', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description Test',
    };

    await createCategoryUseCase.execute(category);

    const categoryCreated = await fakeCategoriesRepository.findByName(
      category.name
    );

    expect(categoryCreated).toHaveProperty('id');
  });

  it('should not be able to create a new category with a name that already exists', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description Test',
    };
    const categoryNew = {
      name: category.name,
      description: 'Category New description Test',
    };

    await createCategoryUseCase.execute(category);

    expect(async () => {
      await createCategoryUseCase.execute(categoryNew);
    }).rejects.toBeInstanceOf(AppError);
  });
});
