import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';

import { UserToken } from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create(data);

    const userTokenCreated = await this.repository.save(userToken);

    return userTokenCreated;
  }

  async findByUserRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken | null> {
    const userTokenFound = await this.repository.findOne({
      user_id,
      refresh_token,
    });

    return userTokenFound || null;
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken | null> {
    const userTokenFound = await this.repository.findOne({
      refresh_token,
    });

    return userTokenFound || null;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { UserTokensRepository };
