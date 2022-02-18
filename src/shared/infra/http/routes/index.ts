import express, { Router } from 'express';

import uploadConfig from '@config/upload';

import { authRoutes } from './auth.routes';
import { carsRoutes } from './cars.routes';
import { categoriesRoutes } from './categories.routes';
import { passwordsRoutes } from './passwords.routes';
import { rentalRoutes } from './rentals.routes';
import { specificationsRoutes } from './specifications.routes';
import { usersRoutes } from './users.routes';

const router = Router();

router.use('/categories', categoriesRoutes);
router.use('/specifications', specificationsRoutes);
router.use('/users', usersRoutes);
router.use('/cars', carsRoutes);
router.use('/rentals', rentalRoutes);
router.use('/password', passwordsRoutes);
router.use('/', authRoutes);

router.use(
  `/files/${uploadConfig.avatarFolderName}`,
  express.static(
    `${uploadConfig.uploadsFolder}/${uploadConfig.avatarFolderName}`
  )
);

router.use(
  `/files/${uploadConfig.carsFolderName}`,
  express.static(`${uploadConfig.uploadsFolder}/${uploadConfig.carsFolderName}`)
);

export { router };
