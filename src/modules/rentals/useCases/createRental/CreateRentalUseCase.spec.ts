import { v4 as uuidv4 } from 'uuid';

import { FakeCarsRepository } from '@modules/cars/repositories/fakes/FakeCarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { FakeRentalsRepository } from '@modules/rentals/repositories/fakes/FakeRentalsRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let fakeRentalsRepository: FakeRentalsRepository;
let fakeCarsRepository: FakeCarsRepository;

let user_id: string;
let car_id: string;
let uuidv4Regex: RegExp;
let expected_return_date: Date;

describe('Create Rental', () => {
  beforeAll(() => {
    user_id = uuidv4();

    uuidv4Regex = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
      'i'
    );

    const d = new Date();
    d.setSeconds(0, 0);
    d.setDate(d.getDate() + 1);
    expected_return_date = d;
  });

  beforeEach(async () => {
    fakeRentalsRepository = new FakeRentalsRepository();
    fakeCarsRepository = new FakeCarsRepository();
    createRentalUseCase = new CreateRentalUseCase(
      fakeRentalsRepository,
      fakeCarsRepository
    );

    const { id } = await fakeCarsRepository.create({
      name: 'Palio',
      description: 'Carro básico',
      daily_rate: 50.0,
      license_plate: 'POI-8251',
      fine_amount: 30,
      brand: 'Fiat',
      category_id: 'f557c2c6-84d1-4aef-979f-c99473885d3b',
    });

    car_id = id;
  });

  it('should be able to register a new car rental', async () => {
    const rentalCreated: Rental = await createRentalUseCase.execute({
      user_id,
      car_id,
      expected_return_date,
    });

    const rentedCar = await fakeCarsRepository.findById(car_id);

    expect(rentalCreated).toBeInstanceOf(Rental);
    expect(rentalCreated).toEqual(
      expect.objectContaining({
        user_id,
        car_id,
        id: expect.stringMatching(uuidv4Regex),
      })
    );
    expect(rentedCar).toBeTruthy();
    expect(rentedCar!.available).toBeFalsy();
  });

  it('should not be able to register a new car rental to a user with an active car rental', async () => {
    await createRentalUseCase.execute({
      user_id,
      car_id,
      expected_return_date,
    });

    await expect(async () => {
      await createRentalUseCase.execute({
        user_id,
        car_id: uuidv4(),
        expected_return_date,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to register a new car rental for an already rented car', async () => {
    await createRentalUseCase.execute({
      user_id,
      car_id,
      expected_return_date,
    });

    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: uuidv4(),
        car_id,
        expected_return_date,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to rent a car expecting to return it before 24 hours of rental', async () => {
    const d = new Date();
    d.setSeconds(0, 0);
    d.setHours(d.getHours() + 23, d.getMinutes());
    const earlyReturnDate = d;

    await expect(async () => {
      await createRentalUseCase.execute({
        user_id,
        car_id,
        expected_return_date: earlyReturnDate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
