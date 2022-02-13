import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ResetPasswordUserUseCase } from './resetPasswordUserUseCase';

class ResetPasswordUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { token: refresh_token } = req.query as { [key: string]: string };
    const { password } = req.body;

    if (!refresh_token || !password) {
      throw new AppError('Invalid password reset');
    }

    const resetPasswordUseCase = container.resolve(ResetPasswordUserUseCase);

    await resetPasswordUseCase.execute({
      refresh_token,
      password,
    });

    return res.send();
  }
}

export { ResetPasswordUserController };
