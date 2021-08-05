import crypto from 'crypto';
import multer from 'multer';
import { resolve } from 'path';

interface IMulterDiskStorageConfig {
  storage: multer.StorageEngine;
}

export default {
  multer(folder: string): IMulterDiskStorageConfig {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', folder),
        filename: (req, file, cb) => {
          const fileHash = crypto.randomBytes(16).toString('hex');
          const normalizedName = file.originalname.replace(/ /g, '_');
          const fileName = `${fileHash}-${normalizedName}`;

          return cb(null, fileName);
        },
      }),
    };
  },
};
