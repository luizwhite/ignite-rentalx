import { inject, injectable } from 'tsyringe';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository
  ) {}

  async execute(data: ICreateRentalDTO): Promise<Rental> {
    const { car_id, user_id, expected_return_date } = data;

    const minimumRentalDurationInHours = 24;

    const carOpenRental = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );
    if (carOpenRental) throw new AppError('Car is unavailable');

    const userOpenRental = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );
    if (userOpenRental)
      throw new AppError('There is an active rental for the user informed!');

    const dateNow = new Date();
    dateNow.setSeconds(0, 0);
    const dateDiffInHours =
      Math.abs(+dateNow - +expected_return_date) / (60 * 60 * 1000);

    if (dateDiffInHours < minimumRentalDurationInHours)
      throw new AppError(
        'Minimum expected return date is 24 hours from rental!'
      );

    const rental = await this.rentalsRepository.create(data);
    return rental;
  }
}

export { CreateRentalUseCase };
