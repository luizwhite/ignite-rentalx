import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { IRentalsRepository } from '../IRentalsRepository';

class FakeRentalsRepository implements IRentalsRepository {
  rentals: Rental[] = [];

  async save(data: ICreateRentalDTO): Promise<Rental> {
    const { id, end_date, ...dataToCreate } = data;

    if (id) {
      const rentalUpdated = this.rentals.find((rental) => rental.id === id)!;

      const dataToUpdate = { ...dataToCreate, end_date };

      Object.assign(rentalUpdated, dataToUpdate);

      const rentalIndex = this.rentals.indexOf(rentalUpdated);
      this.rentals.splice(rentalIndex, 1, rentalUpdated);

      return this.rentals[rentalIndex];
    }

    const rentalCreated = new Rental();

    Object.assign(rentalCreated, dataToCreate);

    this.rentals.push(rentalCreated);

    return this.rentals[this.rentals.indexOf(rentalCreated)];
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

  async findById(id: string): Promise<Rental | null> {
    const rentalFound = this.rentals.find((rental) => rental.id === id);

    return rentalFound || null;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentalsFound = this.rentals.filter(
      (rental) => rental.user_id === user_id
    );

    return rentalsFound;
  }
}

export { FakeRentalsRepository };
