import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

class ShowUserProfileController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const showUserProfileUseCase = container.resolve(ShowUserProfileUseCase);

    const user = await showUserProfileUseCase.execute(id);

    return res.json(user);
  }
}

export { ShowUserProfileController };
