import { validate as uuidValidate, version as uuidVersion } from 'uuid';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IFindAllAvailableDTO } from '@modules/cars/dtos/IFindAllAvailableDTO';
import { IUpdateCarDTO } from '@modules/cars/dtos/IUpdateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';

import { ICarsRepository } from '../ICarsRepository';

class FakeCarsRepository implements ICarsRepository {
  cars: Car[] = [];

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, data);

    this.cars.push(car);

    return this.cars.find((c) => c === car)!;
  }

  async update(data: IUpdateCarDTO): Promise<Car> {
    const { id, specifications: specs } = data;

    const carUpdated = this.cars.find((car) => car.id === id)!;

    let specifications;
    if (specs && Array.isArray(specs)) {
      specifications = specs
        .filter(
          (spec_id) => uuidValidate(spec_id) && uuidVersion(spec_id) === 4
        )
        .filter((spec_id, index, arr) => arr.indexOf(spec_id) === index);

      carUpdated.specifications = carUpdated.specifications || [];
      carUpdated.specifications = specifications as unknown as Specification[];
    }

    type CarUpdatedDataType = Omit<IUpdateCarDTO, 'id' | 'specifications'>;
    const carUpdatedData: CarUpdatedDataType = (({
      name,
      description,
      daily_rate,
      fine_amount,
    }) => ({ name, description, daily_rate, fine_amount }))(data);
    (Object.keys(carUpdatedData) as (keyof CarUpdatedDataType)[]).forEach(
      (key) => carUpdatedData[key] === undefined && delete carUpdatedData[key]
    );
    Object.assign(carUpdated, carUpdatedData);

    const carIndex = this.cars.indexOf(carUpdated);
    this.cars.splice(carIndex, 1, carUpdated);

    return carUpdated;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | null> {
    const carFound = this.cars.find(
      ({ license_plate: cLicensePlate }) => cLicensePlate === license_plate
    );

    return carFound || null;
  }

  async findAllAvailable(data: IFindAllAvailableDTO): Promise<Car[]> {
    const carsFound = this.cars
      .filter(({ available }) => available === true)
      .filter((car) => {
        if (!data) return true;
        let toFilter = false;
        const dataKeys = Object.keys(data) as Array<keyof IFindAllAvailableDTO>;

        dataKeys.forEach((filterCriteria) => {
          if (data[filterCriteria] !== car[filterCriteria]) toFilter = true;
        });
        return !toFilter;
      });
    return carsFound;
  }

  async findById(car_id: string): Promise<Car | null> {
    const carFound = this.cars.find(({ id }) => id === car_id);

    return carFound || null;
  }
}

export { FakeCarsRepository };
