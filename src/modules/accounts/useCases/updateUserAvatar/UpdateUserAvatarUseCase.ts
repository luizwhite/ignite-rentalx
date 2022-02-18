import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';
import { AppError } from '@errors/AppError';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

interface IRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const userFound = await this.usersRepository.findById(user_id);
    if (!userFound)
      throw new AppError('User with the given id does not exist!', 404);

    if (userFound.avatar) {
      await this.storageProvider.deleteFile(
        userFound.avatar,
        uploadConfig.avatarFolderName
      );
    }

    const fileName = await this.storageProvider.saveFile(
      avatar_file,
      uploadConfig.avatarFolderName
    );

    await this.usersRepository.updateAvatar(userFound.id, fileName);
  }
}

export { UpdateUserAvatarUseCase };
