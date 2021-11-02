import { Image } from '../infra/typeorm/entities/Image';

interface ICreateImageDTO {
  car_id: string;
  name: string;
}

interface IImagesRepository {
  create(data: ICreateImageDTO): Promise<Image>;
}

export { IImagesRepository, ICreateImageDTO };
