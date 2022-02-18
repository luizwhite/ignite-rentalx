import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { ensureAdmin } from '@middlewares/ensureAdmin';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { UpdateCarController } from '@modules/cars/useCases/updateCar/UpdateCarController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImage/UploadCarImagesController';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const updateCarController = new UpdateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const uploadCarImagesController = new UploadCarImagesController();

const { carsFolderName } = uploadConfig;
const uploadImages = multer(uploadConfig.multer(carsFolderName));

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);

carsRoutes.put(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  updateCarController.handle
);

carsRoutes.post(
  '/images/:id',
  ensureAuthenticated,
  ensureAdmin,
  uploadImages.array('images'),
  uploadCarImagesController.handle
);

export { carsRoutes };
