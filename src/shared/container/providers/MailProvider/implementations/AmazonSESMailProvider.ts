import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import * as aws from '@aws-sdk/client-ses';
import type { Credentials } from '@aws-sdk/types/dist-types/credentials';
import type { Provider } from '@aws-sdk/types/dist-types/util';
import mailConfig from '@config/mail';

import IMailTemplateProvider from '../../MailTemplateProvider/IMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../IMailProvider';

@injectable()
class AmazonSESEmailProvider implements IMailProvider {
  private client!: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    const credentials: Provider<Credentials> = async () => ({
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || '',
    });

    const ses = new aws.SES({ credentials });

    this.client = nodemailer.createTransport({
      SES: { ses, aws },
    });
  }

  async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    const message = {
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    };

    try {
      await this.client.sendMail(message);
    } catch (err) {
      console.log(err);
    }
  }
}

export { AmazonSESEmailProvider };
