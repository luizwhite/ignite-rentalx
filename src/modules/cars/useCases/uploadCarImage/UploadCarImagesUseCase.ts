import { inject, injectable } from 'tsyringe';

import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { IImagesRepository } from '@modules/cars/repositories/IImagesRepository';

@injectable()
class UploadCarImageUseCase {
  constructor(
    @inject('ImagesRepository')
    private imagesRepository: IImagesRepository
  ) {}

  async execute({ car_id, images }: IUploadCarImagesDTO): Promise<void> {
    await Promise.all(
      images.map(async (imgName) => {
        await this.imagesRepository.create({ car_id, name: imgName });
      })
    );
  }
}

export { UploadCarImageUseCase };
