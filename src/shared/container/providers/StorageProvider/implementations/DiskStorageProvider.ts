import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';
import { deleteFile, ensureDirectoryExistence } from '@utils/file';

import { IStorageProvider } from '../IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  async saveFile(file: string, folder: string): Promise<string> {
    const pathParams = [folder, file];

    const originalPath = path.resolve(uploadConfig.tmpFolder, ...pathParams);
    const newPath = path.resolve(uploadConfig.uploadsFolder, ...pathParams);
    ensureDirectoryExistence(newPath);

    await fs.promises.rename(originalPath, newPath);

    return file;
  }

  async deleteFile(file: string, folder: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, folder, file);

    await deleteFile(filePath);
  }
}

export { DiskStorageProvider };
