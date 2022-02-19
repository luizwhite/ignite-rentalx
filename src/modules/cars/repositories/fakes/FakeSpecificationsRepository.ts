import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';

import {
  ICreateSpecificationDTO,
  ISpecificationsRepository,
} from '../ISpecificationsRepository';

class FakeSpecificationsRepository implements ISpecificationsRepository {
  specifications: Specification[] = [];

  async create(data: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();

    Object.assign(specification, data);

    this.specifications.push(specification);

    return this.specifications[this.specifications.indexOf(specification)];
  }

  async findByName(name: string): Promise<Specification | null> {
    const specFound = this.specifications.find((spec) => spec.name === name);

    return specFound || null;
  }

  async findById(spec_id: string): Promise<Specification | null> {
    const specFound = this.specifications.find(({ id }) => id === spec_id);

    return specFound || null;
  }

  async findByIds(specs_ids: string[]): Promise<Specification[]> {
    const specsFound = this.specifications.filter(({ id }) =>
      specs_ids.includes(id)
    );

    return specsFound;
  }
}

export { FakeSpecificationsRepository };
