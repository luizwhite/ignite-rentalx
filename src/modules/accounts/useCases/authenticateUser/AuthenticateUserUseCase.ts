import { compare as compareHash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import { AppError } from '@errors/AppError';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  async execute({ email: userEmail, password }: IRequest): Promise<IResponse> {
    const userFound = await this.usersRepository.findByEmail(userEmail);
    if (!userFound) throw new AppError('Email or password incorrect!');

    const passwordMatch = await compareHash(password, userFound.password);
    if (!passwordMatch) throw new AppError('Email or password incorrect!');

    const {
      secret_token,
      expires_in_token,
      secret_refresh_token,
      expires_in_refresh_token,
    } = authConfig;

    const token = sign({}, secret_token, {
      subject: userFound.id,
      expiresIn: expires_in_token,
    });

    const refresh_token = sign({ email: userEmail }, secret_refresh_token, {
      subject: userFound.id,
      expiresIn: expires_in_refresh_token,
    });

    const expires_in = expires_in_refresh_token.replace(/\D/, '');
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + parseInt(expires_in, 10));

    await this.userTokensRepository.create({
      user_id: userFound.id,
      refresh_token,
      expires_date: d,
    });

    const user = (({ name, email }) => ({ name, email }))(userFound);

    return {
      user,
      token,
      refresh_token,
    };
  }
}

export { AuthenticateUserUseCase };
