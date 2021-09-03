import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  users: User[] = [];

  async create({
    name,
    email,
    password,
    driver_license,
    avatar = null,
    id,
  }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      name,
      email,
      password,
      driver_license,
      avatar,
      ...(id ? { id } : {}),
    });

    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(({ email: uEmail }) => uEmail === email);

    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(({ id: uId }) => uId === id);

    return user || null;
  }
}

export { FakeUsersRepository };
