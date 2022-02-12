import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserToken } from '../infra/typeorm/entities/UserToken';

interface IUserTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  findByUserRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken | null>;
  deleteById(id: string): Promise<void>;
}

export { IUserTokensRepository };
