import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { deleteFile } from '../../../../utils/file';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const userFound = await this.usersRepository.findById(user_id);
    if (!userFound)
      throw new AppError('User with the given id does not exist!', 404);

    if (userFound.avatar) await deleteFile(`./tmp/avatar/${userFound.avatar}`);
    userFound.avatar = avatar_file;

    await this.usersRepository.create(userFound);
  }
}

export { UpdateUserAvatarUseCase };
