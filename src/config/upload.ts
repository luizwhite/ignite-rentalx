import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import path from 'path';

import { ensureDirectoryExistence } from '@utils/file';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads');

interface IUploadConfig {
  driver: 'amazonS3' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  carsFolderName: string;
  avatarFolderName: string;

  multer(folder: string): { storage: StorageEngine };

  config: { amazonS3: { bucket: string } };
}

const uploadConfig: IUploadConfig = {
  driver: (process.env.STORAGE_DRIVER as IUploadConfig['driver']) || 'amazonS3',

  tmpFolder,
  uploadsFolder,
  carsFolderName: 'cars',
  avatarFolderName: 'avatar',

  multer(folder: string) {
    const tmpPath = path.resolve(tmpFolder, folder);
    ensureDirectoryExistence(tmpPath);

    return {
      storage: multer.diskStorage({
        destination: tmpPath,
        filename: (_req, file, cb) => {
          const fileHash = crypto.randomBytes(16).toString('hex');
          const normalizedName = encodeURIComponent(file.originalname);
          const fileName = `${fileHash}-${normalizedName}`;

          return cb(null, fileName);
        },
      }),
    };
  },

  config: {
    amazonS3: {
      bucket: process.env
        .AWS_S3_BUCKET_NAME as IUploadConfig['config']['amazonS3']['bucket'],
    },
  },
};

export default uploadConfig;
