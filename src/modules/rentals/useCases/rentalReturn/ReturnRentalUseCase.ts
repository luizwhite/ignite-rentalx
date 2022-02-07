import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { IReturnRentalDTO } from '@modules/rentals/dtos/IReturnRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class ReturnRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute(data: IReturnRentalDTO): Promise<Rental> {
    const { id /* , user_id */ } = data;

    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental does not exist!');
    }

    if (rental.end_date) {
      throw new AppError("Can't return this rental again!");
    }

    const { start_date, expected_return_date, car_id } = rental;

    const dateNow = new Date();
    dateNow.setSeconds(0, 0);

    const dateSmallest = Math.min(+dateNow, +expected_return_date);

    const dateDiffInDays_penalty =
      +dateNow > +expected_return_date
        ? (+dateNow - +expected_return_date) / (24 * 60 * 60 * 1000)
        : 0;

    const dateDiffInDays =
      (+dateSmallest - +start_date) / (24 * 60 * 60 * 1000);

    const penaltyDays = dateDiffInDays_penalty;
    const rentedDays = Math.floor(dateDiffInDays) ? dateDiffInDays : 1;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { daily_rate, fine_amount } = (await this.carsRepository.findById(
      car_id
    ))!;

    let totalAmount =
      daily_rate * (rentedDays + penaltyDays) + penaltyDays * fine_amount;
    totalAmount = Math.round(totalAmount * 100) / 100;

    rental.end_date = dateNow;
    rental.total = totalAmount;

    await this.rentalsRepository.save(rental);
    await this.carsRepository.update({ id: car_id, available: true });

    return rental;
  }
}

export { ReturnRentalUseCase };
