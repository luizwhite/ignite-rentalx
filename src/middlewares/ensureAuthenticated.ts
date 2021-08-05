import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { AppError } from '../errors/AppError';
import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository';

export async function ensureAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void | Response> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  const { sub: user_id } = verify(token, 'b0bbe7945ac4a4eca7182c7118e1ccdd');

  const usersRepository = new UsersRepository();
  const userFound = await usersRepository.findById(user_id as string);

  if (!userFound)
    throw new AppError('User does not exist! Invalid token!', 401);

  req.user = { id: user_id as string };

  return next();
}
