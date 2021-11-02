import { getRepository, Repository } from 'typeorm';

import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import {
  ISpecificationsRepository,
  ICreateSpecificationDTO,
} from '@modules/cars/repositories/ISpecificationsRepository';

class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>;

  constructor() {
    this.repository = getRepository(Specification);
  }

  async create(data: ICreateSpecificationDTO): Promise<Specification> {
    const specification = this.repository.create(data);

    const specSaved = await this.repository.save(specification);

    return specSaved;
  }

  async list(): Promise<Specification[]> {
    const specifications = await this.repository.find();

    return specifications;
  }

  async findByName(name: string): Promise<Specification | null> {
    const specificationFound = await this.repository.findOne({ name });

    return specificationFound || null;
  }

  async findById(spec_id: string): Promise<Specification | null> {
    const specification = await this.repository.findOne(spec_id);

    return specification || null;
  }

  async findByIds(specs_ids: string[]): Promise<Specification[]> {
    const specifications = await this.repository.findByIds(specs_ids);

    return specifications;
  }
}

export { SpecificationsRepository };
