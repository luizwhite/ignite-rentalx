import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

class CreateRentalController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { expected_return_date, car_id } = req.body;
    const { id: user_id } = req.user;

    let expected_return_dt: Date;
    if (!(expected_return_date instanceof Date)) {
      if (Number.isNaN(+new Date(expected_return_date))) {
        throw new AppError('Invalid Return Date!');
      }

      expected_return_dt = new Date(expected_return_date);
    } else expected_return_dt = expected_return_date;

    const createRentalUseCase = container.resolve(CreateRentalUseCase);

    const rental = await createRentalUseCase.execute({
      user_id,
      car_id,
      expected_return_date: expected_return_dt,
    });

    return res.json(rental);
  }
}

export { CreateRentalController };
