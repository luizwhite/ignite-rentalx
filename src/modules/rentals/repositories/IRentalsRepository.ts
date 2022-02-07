import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

interface IRentalsRepository {
  save(data: ICreateRentalDTO): Promise<Rental>;
  findOpenRentalByCar(car_id: string): Promise<Rental | null>;
  findOpenRentalByUser(user_id: string): Promise<Rental | null>;
  findById(id: string): Promise<Rental | null>;
  findByUser(user_id: string): Promise<Rental[]>;
}

export { IRentalsRepository };
