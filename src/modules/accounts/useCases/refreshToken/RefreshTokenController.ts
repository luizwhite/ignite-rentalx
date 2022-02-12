import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RefreshTokenUseCase } from './RefreshTokenUseCase';

class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const refresh_token =
      req.body.token || req.headers['x-access-token'] || req.query.token;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const new_refresh_token = await refreshTokenUseCase.execute(refresh_token);

    return res.json(new_refresh_token);
  }
}

export { RefreshTokenController };
