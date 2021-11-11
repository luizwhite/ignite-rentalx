import { AppError } from '@errors/AppError';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { FakeUsersRepository } from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import { CreateUserUseCase } from '@modules/accounts/useCases/createUser/CreateUserUseCase';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let fakeUsersRepository: FakeUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  const userEmail = 'user@test.com';
  const userPassword = '1234';

  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(fakeUsersRepository);
    createUserUseCase = new CreateUserUseCase(fakeUsersRepository);

    const user: ICreateUserDTO = {
      driver_license: '008123',
      email: userEmail,
      password: userPassword,
      name: 'User Test',
    };

    await createUserUseCase.execute(user);
  });

  it('should be able to authenticate an user', async () => {
    const result = await authenticateUserUseCase.execute({
      email: userEmail,
      password: userPassword,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate an user with an nonexistent user', async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: '1234',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with wrong credentials', async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: userEmail,
        password: 'incorrect_password',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
