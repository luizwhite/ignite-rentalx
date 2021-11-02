import { getRepository, Repository } from 'typeorm';

import {
  ICreateImageDTO,
  IImagesRepository,
} from '@modules/cars/repositories/IImagesRepository';

import { Image } from '../entities/Image';

class ImagesRepository implements IImagesRepository {
  private repository: Repository<Image>;

  constructor() {
    this.repository = getRepository(Image);
  }

  async create({ car_id, name }: ICreateImageDTO): Promise<Image> {
    const image = this.repository.create({
      car_id,
      name,
    });

    const imageSaved = await this.repository.save(image);
    return imageSaved;
  }
}

export { ImagesRepository };
