import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import { IResetPasswordDTO } from '@modules/accounts/dtos/IResetPasswordDTO';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  async execute({ refresh_token, password }: IResetPasswordDTO): Promise<void> {
    const userTokenFound = await this.userTokensRepository.findByRefreshToken(
      refresh_token
    );

    if (!userTokenFound) throw new AppError('Token does not exist!', 404);

    const dateNow = new Date();
    dateNow.setSeconds(0, 0);

    if (+userTokenFound.expires_date <= +dateNow) {
      await this.userTokensRepository.deleteById(userTokenFound.id);

      throw new AppError('Token expired!', 401);
    }

    const userFound = await this.usersRepository.findById(
      userTokenFound.user_id
    );

    if (!userFound) throw new AppError('User does not exist!', 404);

    const updatedPassword = await hash(password, 8);

    await this.usersRepository.updatePassword(
      userTokenFound.user_id,
      updatedPassword
    );

    await this.userTokensRepository.deleteById(userTokenFound.id);
  }
}

export { ResetPasswordUserUseCase };
