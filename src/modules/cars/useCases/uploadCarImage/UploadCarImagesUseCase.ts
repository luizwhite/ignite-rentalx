import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';
import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { IImagesRepository } from '@modules/cars/repositories/IImagesRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

@injectable()
class UploadCarImageUseCase {
  constructor(
    @inject('ImagesRepository')
    private imagesRepository: IImagesRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ car_id, images }: IUploadCarImagesDTO): Promise<void> {
    await Promise.all(
      images.map(async (imgName) => {
        const fileName = await this.storageProvider.saveFile(
          imgName,
          uploadConfig.carsFolderName
        );

        await this.imagesRepository.create({ car_id, name: fileName });
      })
    );
  }
}

export { UploadCarImageUseCase };
