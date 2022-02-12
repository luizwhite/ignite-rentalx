import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import { AppError } from '@errors/AppError';
import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';

export async function ensureAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void | Response> {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new AppError('Token missing', 401);

  const [, token] = authHeader.split(' ');

  const { sub: user_id } = verify(token, authConfig.secret_token) as JwtPayload;
  if (!user_id) throw new AppError('Invalid token!', 401);

  const usersRepository = new UsersRepository();
  const userFound = await usersRepository.findById(user_id);

  if (!userFound)
    throw new AppError('User does not exist! Invalid token!', 401);

  req.user = { id: user_id };

  return next();
}
