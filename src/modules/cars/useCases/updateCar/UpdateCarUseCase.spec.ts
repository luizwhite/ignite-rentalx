import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IUpdateCarDTO } from '@modules/cars/dtos/IUpdateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { FakeCarsRepository } from '@modules/cars/repositories/fakes/FakeCarsRepository';
import { FakeSpecificationsRepository } from '@modules/cars/repositories/fakes/FakeSpecificationsRepository';
import { ICreateSpecificationDTO } from '@modules/cars/repositories/ISpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

import { UpdateCarUseCase } from './UpdateCarUseCase';

let fakeCarsRepository: FakeCarsRepository;
let fakeSpecificationsRepository: FakeSpecificationsRepository;
let updateCarUseCase: UpdateCarUseCase;

let specCreated: Specification;
let specData: ICreateSpecificationDTO;
let specsData: string[];
let car: Car;
let carData: ICreateCarDTO;
let specifications_ids: string[];

let uuidv4Regex: RegExp;

describe('Update Car', () => {
  const builtInSpecName = 'specName';

  async function normalizeFakeSpecifications(
    specs: Specification[] | undefined,
    fakeRepository: FakeSpecificationsRepository
  ): Promise<Specification[]> {
    const newSpecs = specs || [];

    return Promise.all(
      newSpecs.map(
        async (spec_id) =>
          fakeRepository.findById(
            spec_id as unknown as string
          )! as unknown as Specification
      )
    );
  }

  beforeAll(() => {
    specData = {
      name: builtInSpecName,
      description: 'specDescription',
    };

    carData = {
      brand: 'carBrand',
      name: 'carName',
      daily_rate: 100,
      fine_amount: 80,
      description: 'carDescription',
      license_plate: 'DUF-3245',
      category_id: 'carCategoryId',
      specifications: [],
    };

    specsData = ['Specification 01', 'Specification 02', 'Specification 03'];

    uuidv4Regex = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/,
      'i'
    );
  });

  beforeEach(async () => {
    fakeCarsRepository = new FakeCarsRepository();
    fakeSpecificationsRepository = new FakeSpecificationsRepository();
    updateCarUseCase = new UpdateCarUseCase(fakeCarsRepository);

    specCreated = await fakeSpecificationsRepository.create(specData);
    Object.assign(carData, { specifications: [specCreated.id] });

    car = await fakeCarsRepository.create(carData);

    specifications_ids = await Promise.all(
      specsData.map(async (s) => {
        const specification = await fakeSpecificationsRepository.create({
          description: s,
          name: s,
        });

        return specification.id;
      })
    );

    specifications_ids.push('unregistered_spec_id');
  });

  it('should be able to update car information.', async () => {
    const updatedName = 'updatedName';
    const updatedDescription = 'updatedDescription';
    const updatedDailyRate = 120;
    const updateFineAmount = 90;

    await updateCarUseCase.execute({
      id: car.id,
      name: updatedName,
      description: updatedDescription,
      daily_rate: updatedDailyRate,
      fine_amount: updateFineAmount,
    });

    car.specifications = await normalizeFakeSpecifications(
      car.specifications,
      fakeSpecificationsRepository
    );

    expect(car).toBeInstanceOf(Car);
    expect(car).toEqual(
      expect.objectContaining({
        id: car.id,
        name: updatedName,
        description: updatedDescription,
        daily_rate: updatedDailyRate,
        fine_amount: updateFineAmount,
      })
    );

    car.specifications.forEach((spec) =>
      expect(spec).toBeInstanceOf(Specification)
    );
    expect(car.specifications.length).toBe(1);
  });

  it('should be able to include/exclude one or more car specs & should be able to list all the updated car specs.', async () => {
    await updateCarUseCase.execute({
      id: car.id,
      specifications: specifications_ids,
    });

    car.specifications = await normalizeFakeSpecifications(
      car.specifications,
      fakeSpecificationsRepository
    );

    expect(car.specifications?.length).toBe(3);
    expect(car.specifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: specsData[0],
          id: expect.stringMatching(uuidv4Regex),
        }),
        expect.objectContaining({
          name: specsData[1],
          id: expect.stringMatching(uuidv4Regex),
        }),
        expect.objectContaining({
          name: specsData[2],
          id: expect.stringMatching(uuidv4Regex),
        }),
        expect.not.objectContaining({
          name: builtInSpecName,
        }),
      ])
    );
  });

  it('should not be able to update a car with an unregistered car id.', async () => {
    await expect(async () => {
      await updateCarUseCase.execute({
        id: 'unregistered_car_id',
        specifications: specifications_ids,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to include a new car spec when duplicate.', async () => {
    specifications_ids.pop();
    expect(specifications_ids.length).toBe(3);

    await updateCarUseCase.execute({
      id: car.id,
      specifications: [...specifications_ids, specifications_ids[0]],
    });

    car.specifications = await normalizeFakeSpecifications(
      car.specifications,
      fakeSpecificationsRepository
    );

    expect(car.specifications?.length).toBe(3);
  });

  it("should not be able to change a car's license plate.", async () => {
    const updatedLicensePlate = 'AJR-8127';

    interface IWrongUpdateCarDTO extends IUpdateCarDTO {
      license_plate: string;
    }
    type WrongExecuteType = (data: IWrongUpdateCarDTO) => Promise<Car>;

    await (updateCarUseCase.execute as WrongExecuteType)({
      id: car.id,
      license_plate: updatedLicensePlate,
    });

    expect(updatedLicensePlate).not.toEqual(carData.license_plate);

    car.specifications = await normalizeFakeSpecifications(
      car.specifications,
      fakeSpecificationsRepository
    );

    expect(car).toBeInstanceOf(Car);
    expect(car).toEqual(
      expect.objectContaining({
        id: car.id,
        license_plate: carData.license_plate,
      })
    );
  });
});
