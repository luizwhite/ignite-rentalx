import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      ...data,
      start_date: new Date(),
    });

    const rentalSaved = await this.repository.save(rental);

    return rentalSaved;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental | null> {
    const rentalFound = await this.repository.findOne({ car_id });

    return rentalFound || null;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental | null> {
    const rentalFound = await this.repository.findOne({ user_id });

    return rentalFound || null;
  }
}

export { RentalsRepository };
