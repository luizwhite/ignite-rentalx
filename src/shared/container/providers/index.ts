import { container } from 'tsyringe';

import { IMailProvider } from './MailProvider/IMailProvider';
import { EtherealMailProvider } from './MailProvider/implementations/EtherealMailProvider';
import IMailTemplateProvider from './MailTemplateProvider/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlerbarsMailTemplateProvider';

const mailTemplateProviders = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  mailTemplateProviders.handlebars
);

container.registerInstance<IMailProvider>(
  'EtherealMailProvider',
  container.resolve<IMailProvider>(EtherealMailProvider)
);
