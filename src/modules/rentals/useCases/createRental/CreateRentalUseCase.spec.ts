import { v4 as uuidv4 } from 'uuid';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { FakeRentalsRepository } from '@modules/rentals/repositories/fakes/FakeRentalsRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let fakeRentalsRepository: FakeRentalsRepository;

let user_id: string;
let car_id: string;
let uuidv4Regex: RegExp;
let expected_return_date: Date;

describe('Create Rental', () => {
  beforeAll(() => {
    user_id = uuidv4();
    car_id = uuidv4();

    uuidv4Regex = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
      'i'
    );

    const d = new Date();
    d.setSeconds(0, 0);
    d.setDate(d.getDate() + 1);
    expected_return_date = d;
  });

  beforeEach(() => {
    fakeRentalsRepository = new FakeRentalsRepository();
    createRentalUseCase = new CreateRentalUseCase(fakeRentalsRepository);
  });

  it('should be able to register a new car rental', async () => {
    const rentalCreated: Rental = await createRentalUseCase.execute({
      user_id,
      car_id,
      expected_return_date,
    });

    expect(rentalCreated).toBeInstanceOf(Rental);
    expect(rentalCreated).toEqual(
      expect.objectContaining({
        user_id,
        car_id,
        id: expect.stringMatching(uuidv4Regex),
      })
    );
  });

  it('should not be able to register a new car rental to a user with an active car rental', async () => {
    await createRentalUseCase.execute({
      user_id,
      car_id,
      expected_return_date,
    });

    expect(async () => {
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

    expect(async () => {
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

    expect(async () => {
      await createRentalUseCase.execute({
        user_id,
        car_id,
        expected_return_date: earlyReturnDate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
