import { inject, injectable } from 'tsyringe';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute(data: ICreateCarDTO): Promise<Car> {
    const { license_plate } = data;

    const carFound = await this.carsRepository.findByLicensePlate(
      license_plate
    );
    if (carFound)
      throw new AppError('Car with the given license plate already exists!');

    const car = this.carsRepository.create(data);

    return car;
  }
}

export { CreateCarUseCase };
