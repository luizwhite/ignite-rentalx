import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserToken } from '@modules/accounts/infra/typeorm/entities/UserToken';

import { IUserTokensRepository } from '../IUserTokensRepository';

class FakeUserTokensRepository implements IUserTokensRepository {
  userTokens: UserToken[] = [];

  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, data);

    this.userTokens.push(userToken);

    return this.userTokens[this.userTokens.indexOf(userToken)];
  }

  async findByUserRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken | null> {
    const userTokenFound = this.userTokens.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token
    );

    return userTokenFound || null;
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken | null> {
    const userTokenFound = this.userTokens.find(
      (userToken) => userToken.refresh_token === refresh_token
    );

    return userTokenFound || null;
  }

  async deleteById(id: string): Promise<void> {
    const userTokenFound = this.userTokens.find(
      (userToken) => userToken.id === id
    );

    if (!userTokenFound) return;

    this.userTokens.splice(this.userTokens.indexOf(userTokenFound), 1);
  }
}

export { FakeUserTokensRepository };
