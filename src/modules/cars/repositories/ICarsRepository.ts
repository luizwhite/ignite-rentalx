import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IFindAllAvailableDTO } from '../dtos/IFindAllAvailableDTO';
import { IUpdateCarDTO } from '../dtos/IUpdateCarDTO';
import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  update(data: IUpdateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car | null>;
  findAllAvailable(data: IFindAllAvailableDTO): Promise<Car[]>;
  findById(car_id: string): Promise<Car | null>;
}

export { ICarsRepository };
