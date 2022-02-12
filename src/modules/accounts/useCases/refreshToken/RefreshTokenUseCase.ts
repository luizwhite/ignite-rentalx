import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';
import { AppError } from '@shared/errors/AppError';

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}

  async execute(refresh_token: string): Promise<ITokenResponse> {
    const decoded = verify(
      refresh_token,
      authConfig.secret_refresh_token
    ) as JwtPayload;

    const user_id = decoded.sub;

    if (!user_id) throw new AppError('Invalid token!', 401);

    const userTokenFound =
      await this.userTokensRepository.findByUserRefreshToken(
        user_id,
        refresh_token
      );

    if (!userTokenFound) {
      throw new AppError('Refresh Token does not exist!');
    }

    await this.userTokensRepository.deleteById(userTokenFound.id);

    const token = sign({}, authConfig.secret_token, {
      subject: user_id,
      expiresIn: authConfig.expires_in_token,
    });

    const new_refresh_token = sign(
      { email: decoded.email },
      authConfig.secret_refresh_token,
      {
        subject: user_id,
        expiresIn: authConfig.expires_in_refresh_token,
      }
    );

    const expires_in = authConfig.expires_in_refresh_token.replace(/\D/, '');
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + parseInt(expires_in, 10));

    await this.userTokensRepository.create({
      user_id,
      refresh_token: new_refresh_token,
      expires_date: d,
    });

    return { token, refresh_token: new_refresh_token };
  }
}

export { RefreshTokenUseCase };
