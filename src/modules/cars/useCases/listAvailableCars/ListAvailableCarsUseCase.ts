import { inject, injectable } from 'tsyringe';

import { IFindAllAvailableDTO } from '@modules/cars/dtos/IFindAllAvailableDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute(data: IFindAllAvailableDTO): Promise<Car[]> {
    const cars = await this.carsRepository.findAllAvailable(data);
    return cars;
  }
}

export { ListAvailableCarsUseCase };
