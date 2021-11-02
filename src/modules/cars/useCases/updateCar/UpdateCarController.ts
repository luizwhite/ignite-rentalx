import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateCarUseCase } from './UpdateCarUseCase';

class UpdateCarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    const updateCarUseCase = container.resolve(UpdateCarUseCase);

    const car = await updateCarUseCase.execute(data);

    return res.status(200).json(car);
  }
}

export { UpdateCarController };
