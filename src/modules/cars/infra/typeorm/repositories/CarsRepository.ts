import { getRepository, Repository } from 'typeorm';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IFindAllAvailableDTO } from '@modules/cars/dtos/IFindAllAvailableDTO';
import { IUpdateCarDTO } from '@modules/cars/dtos/IUpdateCarDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';
import { Specification } from '../entities/Specification';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create(data: ICreateCarDTO<string>): Promise<Car> {
    const specificationsRepository = getRepository(Specification);
    const existentSpecifications = await specificationsRepository.find();

    let specifications;
    if (data.specifications)
      specifications = data.specifications
        .filter((id) => uuidValidate(id) && uuidVersion(id) === 4)
        .filter((id) =>
          existentSpecifications.some(({ id: eId }) => eId === id)
        )
        .map((id) => ({ id }));

    const car = this.repository.create({ ...data, specifications });

    let carSaved = await this.repository.save(car);
    carSaved = (await this.repository.findOne(carSaved.id))!;

    return carSaved;
  }

  async update({
    id: car_id,
    name,
    description,
    daily_rate,
    fine_amount,
    specifications: specs,
  }: IUpdateCarDTO): Promise<Car> {
    const specificationsRepository = getRepository(Specification);
    const existentSpecifications = await specificationsRepository.find();

    let specifications;
    if (specs)
      specifications = specs
        .filter((id) => uuidValidate(id) && uuidVersion(id) === 4)
        .filter((id) =>
          existentSpecifications.some(({ id: eId }) => eId === id)
        )
        .filter((id, index, arr) => arr.indexOf(id) === index)
        .map((id) => ({ id }));

    const updateData = {
      id: car_id,
      name,
      description,
      daily_rate,
      fine_amount,
      specifications,
    };

    const car = this.repository.create(updateData);

    let carSaved = await this.repository.save(car);
    carSaved = (await this.repository.findOne(carSaved.id))!;

    return carSaved;
  }

  async findById(id: string): Promise<Car | null> {
    const carFound = await this.repository.findOne(id);

    return carFound || null;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | null> {
    const carFound = await this.repository.findOne({
      license_plate,
    });

    return carFound || null;
  }

  async findAllAvailable(data: IFindAllAvailableDTO): Promise<Car[]> {
    const carsFound = await this.repository.find({
      available: true,
      ...data,
    });

    return carsFound;
  }
}

export { CarsRepository };
