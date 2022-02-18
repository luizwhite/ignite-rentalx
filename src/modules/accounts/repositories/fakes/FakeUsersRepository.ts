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
    const userFound = this.users.find((user) => user.email === email);

    return userFound || null;
  }

  async findById(id: string): Promise<User | null> {
    const userFound = this.users.find((user) => user.id === id);

    return userFound || null;
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const userFound = this.users.find((user) => user.id === id);

    if (!userFound) return;

    this.users[this.users.indexOf(userFound)].password = password;
  }

  async updateAvatar(id: string, avatar: string): Promise<void> {
    const userFound = this.users.find((user) => user.id === id);

    if (!userFound) return;

    this.users[this.users.indexOf(userFound)].avatar = avatar;
  }
}

export { FakeUsersRepository };
