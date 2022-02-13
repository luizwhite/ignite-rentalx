import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('EtherealMailProvider')
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const userFound = await this.usersRepository.findByEmail(email);

    if (!userFound) {
      throw new AppError('User with the given email does not exist!', 404);
    }

    const token = uuidv4();
    const expires_in = 3;

    const d = new Date();
    d.setHours(d.getHours() + expires_in);
    d.setSeconds(0, 0);

    await this.userTokensRepository.create({
      refresh_token: token,
      user_id: userFound.id,
      expires_date: d,
    });

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'mails',
      'forgotPassword.hbs'
    );

    await this.mailProvider.sendMail({
      to: {
        name: userFound.name,
        email: userFound.email,
      },
      subject: '[RentX] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: userFound.name,
          link: `${process.env.FORGOT_MAIL_URL}${token}`,
        },
      },
    });
  }
}

export { SendForgotPasswordMailUseCase };
