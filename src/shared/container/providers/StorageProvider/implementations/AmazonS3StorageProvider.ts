import fs from 'fs';
import mime from 'mime';
import path from 'path';

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import type { Credentials } from '@aws-sdk/types/dist-types/credentials';
import type { Provider } from '@aws-sdk/types/dist-types/util';
import uploadConfig from '@config/upload';
import { AppError } from '@shared/errors/AppError';
import { deleteFile } from '@utils/file';

import { IStorageProvider } from '../IStorageProvider';

class AmazonS3StorageProvider implements IStorageProvider {
  private client: S3Client;

  constructor() {
    const credentials: Provider<Credentials> = async () => ({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
    });

    this.client = new S3Client({
      credentials,
    });
  }

  async saveFile(file: string, folder: string): Promise<string> {
    const pathParams = [folder, file];

    const originalPath = path.resolve(uploadConfig.tmpFolder, ...pathParams);

    const ContentType = mime.getType(originalPath);
    if (!ContentType) throw new Error('File not found');

    const fileContent = await fs.promises.readFile(originalPath);

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: uploadConfig.config.amazonS3.bucket,
          Key: `${folder}/${file}`,
          ContentType,
          Body: fileContent,
        })
      );
    } catch (err) {
      console.log(err);
      throw new AppError((err as any).message);
    }

    await deleteFile(originalPath);

    return file;
  }

  async deleteFile(file: string, folder: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: uploadConfig.config.amazonS3.bucket,
          Key: `${folder}/${file}`,
        })
      );
    } catch (err) {
      console.log(err);
      throw new AppError((err as any).message);
    }
  }
}

export { AmazonS3StorageProvider };
