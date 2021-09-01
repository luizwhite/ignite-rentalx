import { compare as compareHash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

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
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email: userEmail, password }: IRequest): Promise<IResponse> {
    const userFound = await this.usersRepository.findByEmail(userEmail);
    if (!userFound) throw new AppError('Email or password incorrect!');

    const passwordMatch = await compareHash(password, userFound.password);
    if (!passwordMatch) throw new AppError('Email or password incorrect!');

    const token = sign({}, 'b0bbe7945ac4a4eca7182c7118e1ccdd', {
      subject: userFound.id,
      expiresIn: '1d',
    });

    const user = (({ name, email }) => ({ name, email }))(userFound);

    return {
      user,
      token,
    };
  }
}

export { AuthenticateUserUseCase };
