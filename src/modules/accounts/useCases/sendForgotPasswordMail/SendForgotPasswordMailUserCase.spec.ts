import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { FakeUsersRepository } from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import { FakeUserTokensRepository } from '@modules/accounts/repositories/fakes/FakeUserTokensRepository';
import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let createUserUseCase: CreateUserUseCase;

let user_id: string;

describe('Send Forgot Password Mail', () => {
  const userEmail = 'user@test.com';
  const userPassword = '1234';

  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    createUserUseCase = new CreateUserUseCase(fakeUsersRepository);
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider
    );

    const userDTO: ICreateUserDTO = {
      driver_license: '008123',
      email: userEmail,
      password: userPassword,
      name: 'User Test',
    };

    await createUserUseCase.execute(userDTO);

    const { id } = (await fakeUsersRepository.findByEmail(userEmail))!;
    user_id = id;
  });

  it('should be able to send an e-mail with password recovery instructions', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await sendForgotPasswordMailUseCase.execute(userEmail);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send a password recovery e-mail to a non-existing user', async () => {
    await expect(async () => {
      await sendForgotPasswordMailUseCase.execute(
        'non_existing_user@example.com'
      );
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate a forgotten password refresh token', async () => {
    const create = jest.spyOn(fakeUserTokensRepository, 'create');

    await sendForgotPasswordMailUseCase.execute(userEmail);

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id,
      })
    );
  });
});
