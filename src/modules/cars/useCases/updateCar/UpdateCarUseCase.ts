import { inject, injectable } from 'tsyringe';

import { IUpdateCarDTO } from '@modules/cars/dtos/IUpdateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class UpdateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute(data: IUpdateCarDTO): Promise<Car> {
    const { id } = data;

    const carFound = await this.carsRepository.findById(id);
    if (!carFound || !id)
      throw new AppError('Car with the given id does not exist to update!');

    const car = this.carsRepository.update(data);

    return car;
  }
}

export { UpdateCarUseCase };
