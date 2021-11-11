import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { FakeCarsRepository } from '@modules/cars/repositories/fakes/FakeCarsRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let fakeCarsRepository: FakeCarsRepository;

let carData: ICreateCarDTO;

describe('Create Car', () => {
  beforeAll(() => {
    carData = {
      name: 'car Name',
      description: 'car Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'car Brand',
      category_id: 'category_id',
    };
  });

  beforeEach(() => {
    fakeCarsRepository = new FakeCarsRepository();
    createCarUseCase = new CreateCarUseCase(fakeCarsRepository);
  });

  it('should be able to register a new car', async () => {
    const car = await createCarUseCase.execute(carData);

    expect(car).toHaveProperty('id');
  });

  it('should not be able to register a car with an existent license place', async () => {
    await createCarUseCase.execute({
      ...carData,
      name: 'Car 1',
    });

    await expect(async () => {
      await createCarUseCase.execute({
        ...carData,
        name: 'Car 2',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to register a car available by default', async () => {
    const car = await createCarUseCase.execute({
      ...carData,
      name: 'Car Available',
      license_plate: 'CBA-4321',
    });

    expect(car).toHaveProperty('available', true);
  });
});
