import { v4 as uuidv4 } from 'uuid';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { FakeCarsRepository } from '@modules/cars/repositories/fakes/FakeCarsRepository';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listCarsUseCase: ListAvailableCarsUseCase;
let fakeCarsRepository: FakeCarsRepository;

let carsData: ICreateCarDTO[];
let uuidv4Regex: RegExp;

describe('List Cars', () => {
  beforeAll(() => {
    carsData = [
      {
        name: 'car Name',
        description: 'car Description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'brand Name',
        category_id: uuidv4(),
      },
      {
        name: 'car 2 Name',
        description: 'car 2 Description',
        daily_rate: 80,
        license_plate: 'CBA-4321',
        fine_amount: 70,
        brand: 'brand Name',
        category_id: uuidv4(),
      },
      {
        name: 'car 3 Name',
        description: 'car 3 Description',
        daily_rate: 110,
        license_plate: 'EFD-9235',
        fine_amount: 80,
        brand: 'car 3 brand Name',
        category_id: uuidv4(),
      },
    ];

    uuidv4Regex = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
      'i'
    );
  });

  beforeEach(() => {
    fakeCarsRepository = new FakeCarsRepository();
    listCarsUseCase = new ListAvailableCarsUseCase(fakeCarsRepository);

    fakeCarsRepository.create(carsData[0]);
    fakeCarsRepository.create(carsData[1]);
    fakeCarsRepository.create(carsData[2]);
  });

  it('should be able to list all available cars', async () => {
    const cars = await listCarsUseCase.execute({});

    expect(cars.length).toBe(3);
    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...carsData[0],
          id: expect.stringMatching(uuidv4Regex),
        }),
        expect.objectContaining({
          ...carsData[1],
          id: expect.stringMatching(uuidv4Regex),
        }),
        expect.objectContaining({
          ...carsData[3],
          id: expect.stringMatching(uuidv4Regex),
        }),
      ])
    );
  });

  it('should be able to list all available cars by category', async () => {
    const carModel = carsData[1];

    const cars = await listCarsUseCase.execute({
      category_id: carModel.category_id,
    });

    expect(cars.length).toBe(1);
    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...carModel,
          id: expect.stringMatching(uuidv4Regex),
        }),
      ])
    );
  });

  it('should be able to list all available cars by brand', async () => {
    const carModel = carsData[0];
    const carModel2 = carsData.find(({ brand }) => brand === carModel.brand)!;

    const cars = await listCarsUseCase.execute({
      brand: carModel.brand,
    });

    expect(cars.length).toBe(2);
    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...carModel,
          id: expect.stringMatching(uuidv4Regex),
        }),
        expect.objectContaining({
          ...carModel2,
          id: expect.stringMatching(uuidv4Regex),
        }),
      ])
    );
  });

  it('should be able to list all available cars by name', async () => {
    const carModel = carsData[2];

    const cars = await listCarsUseCase.execute({
      name: carModel.name,
    });

    expect(cars.length).toBe(1);
    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...carModel,
          id: expect.stringMatching(uuidv4Regex),
        }),
      ])
    );
  });

  it('should be able to list all available cars by any criteria combination', async () => {
    const carModel = carsData[2];

    const cars = await listCarsUseCase.execute({
      name: carModel.name,
      brand: carModel.brand,
      category_id: carModel.category_id,
    });

    const emptyList_01 = await listCarsUseCase.execute({
      name: carsData[0].name,
      brand: carModel.brand,
      category_id: carModel.category_id,
    });

    const emptyList_02 = await listCarsUseCase.execute({
      name: carModel.name,
      brand: carModel.brand,
      category_id: carsData[1].category_id,
    });

    const emptyList_03 = await listCarsUseCase.execute({
      name: carModel.name,
      brand: 'nonexistent_brand',
      category_id: carsData[1].category_id,
    });

    expect(cars.length).toBe(1);
    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...carModel,
          id: expect.stringMatching(uuidv4Regex),
        }),
      ])
    );

    expect(emptyList_01).toEqual([]);
    expect(emptyList_02).toEqual([]);
    expect(emptyList_03).toEqual([]);
  });
});
