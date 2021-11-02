import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { IRentalsRepository } from '../IRentalsRepository';

class FakeRentalsRepository implements IRentalsRepository {
  rentals: Rental[] = [];

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    const additionalData = { start_date: new Date() };
    Object.assign(rental, { ...data, ...additionalData });

    this.rentals.push(rental);

    return this.rentals.find((r) => r === rental)!;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental | null> {
    return (
      this.rentals.find(
        (rental) => rental.car_id === car_id && !rental.end_date
      ) || null
    );
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental | null> {
    return (
      this.rentals.find(
        (rental) => rental.user_id === user_id && !rental.end_date
      ) || null
    );
  }
}

export { FakeRentalsRepository };
