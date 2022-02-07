import { getRepository, Repository, IsNull } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async save(data: ICreateRentalDTO): Promise<Rental> {
    let rental: Partial<Rental> = data;

    if (!data.id) rental = this.repository.create(data);

    const rentalSaved = await this.repository.save(rental);

    return rentalSaved;
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental | null> {
    const rentalFound = await this.repository.findOne({
      car_id,
      end_date: IsNull(),
    });

    return rentalFound || null;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental | null> {
    const rentalFound = await this.repository.findOne({
      user_id,
      end_date: IsNull(),
    });

    return rentalFound || null;
  }

  async findById(id: string): Promise<Rental | null> {
    const rentalFound = await this.repository.findOne(id);

    return rentalFound || null;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentalsFound = await this.repository.find({
      where: {
        user_id,
      },
      relations: ['car'],
    });

    return rentalsFound;
  }
}

export { RentalsRepository };
