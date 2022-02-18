import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { ShowUserProfileController } from '@modules/accounts/useCases/showUserProfile/ShowUserProfileUseCaseController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';

const usersRoutes = Router();

const { avatarFolderName } = uploadConfig;
const uploadAvatar = multer(uploadConfig.multer(avatarFolderName));

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const showUserProfileController = new ShowUserProfileController();

usersRoutes.post('/', createUserController.handle);

usersRoutes.use(ensureAuthenticated);

usersRoutes.get('/profile', showUserProfileController.handle);

usersRoutes.patch(
  '/avatar',
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle
);

export { usersRoutes };
