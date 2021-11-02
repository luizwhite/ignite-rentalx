import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImageUseCase } from './UploadCarImagesUseCase';

class UploadCarImagesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const images = req.files as Express.Multer.File[] | undefined;

    if (!id || !images)
      return res.status(400).json({ error: 'file required!' });

    const uploadCarImagesUseCase = container.resolve(UploadCarImageUseCase);

    const fileNames = images.map((file) => file.filename);

    await uploadCarImagesUseCase.execute({
      car_id: id,
      images: fileNames,
    });

    return res.status(201).send();
  }
}

export { UploadCarImagesController };
