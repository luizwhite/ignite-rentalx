import { instanceToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IUser {
  name: string;
  email: string;
  driver_license: string;
  avatar_url: string;
}

@injectable()
class ShowUserProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<IUser> {
    let userFound: IUser | null = await this.usersRepository.findById(id);

    if (!userFound) {
      throw new AppError('User with the given email does not exist!', 404);
    }

    userFound = (({ name, email, driver_license, avatar_url }) => ({
      name,
      email,
      driver_license,
      avatar_url,
    }))(instanceToInstance(userFound));

    return userFound;
  }
}

export { ShowUserProfileUseCase };
