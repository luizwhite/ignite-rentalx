import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import IMailTemplateProvider from '../../MailTemplateProvider/IMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../IMailProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client!: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    nodemailer
      .createTestAccount()
      .then(({ smtp, user, pass }) => {
        const { host, port, secure } = smtp;

        const transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user,
            pass,
          },
        });

        this.client = transporter;
      })
      .catch((err) => console.error(err));
  }

  async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = {
      to: {
        name: to.name,
        address: to.email,
      },
      from: {
        name: from?.name || 'Equipe RentX',
        address: from?.email || 'noreply@rentx.com.br',
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    };

    const info = await this.client?.sendMail(message);

    if (!message) throw new AppError('No message created!');

    console.log('Message sent: %s', info?.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

export { EtherealMailProvider };
