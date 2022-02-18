import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import uploadConfig from '@config/upload';

import { IMailProvider } from './MailProvider/IMailProvider';
import { AmazonSESEmailProvider } from './MailProvider/implementations/AmazonSESMailProvider';
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider';
import IMailTemplateProvider from './MailTemplateProvider/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlerbarsMailTemplateProvider';
import { AmazonS3StorageProvider } from './StorageProvider/implementations/AmazonS3StorageProvider';
import { DiskStorageProvider } from './StorageProvider/implementations/DiskStorageProvider';
import { IStorageProvider } from './StorageProvider/IStorageProvider';

const mailTemplateProviders = {
  handlebars: HandlebarsMailTemplateProvider,
};

const mailProviders = {
  ethereal: EtherealMailProvider,
  amazonSES: AmazonSESEmailProvider,
};

const storageProviders = {
  disk: DiskStorageProvider,
  amazonS3: AmazonS3StorageProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  mailTemplateProviders.handlebars
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve<IMailProvider>(mailProviders[mailConfig.driver])
);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  storageProviders[uploadConfig.driver]
);
