import { Injectable, NotFoundException } from '@nestjs/common';
import { useCatch } from '../../../app/utils/use-catch';
import { sign, verify } from 'jsonwebtoken';
import { configurations } from '../../../app/configurations';
import { UsersService } from '../users.service';
import { JwtPayloadType } from '../users.type';

@Injectable()
export class CheckUserService {
  constructor(private readonly usersService: UsersService) {}

  async createRefreshToken(payload: JwtPayloadType) {
    const user = await this.usersService.findOneBy({
      option1: { userId: `${payload?.id}` },
    });

    const refreshToken = await this.createJwtToken('refresh', payload);
    if (!user.refreshToken) {
      await this.usersService.updateOne(
        { option1: { userId: `${payload?.id}` } },
        { refreshToken: [refreshToken] },
      );
    } else {
      await this.usersService.updateOne(
        { option1: { userId: `${payload?.id}` } },
        { refreshToken: [...user.refreshToken, refreshToken] },
      );
    }

    return refreshToken;
  }

  /** Create one createJwtToken for use and save to the database. */
  async createJwtToken(type: 'access' | 'refresh', payload: JwtPayloadType) {
    const secret =
      type === 'access'
        ? configurations.jwt.secret
        : configurations.jwt.refreshSecret;
    const expiresIn =
      type === 'access'
        ? configurations.jwt.expiration
        : configurations.jwt.refreshExpiration;

    return sign(payload, secret, { expiresIn });
  }

  async verifyToken(token: string) {
    const secret = configurations.jwt.secret;
    return new Promise((resolve, reject) => {
      return verify(token, secret, (error, result) => {
        if (error) {
          return reject(error.message);
        } else {
          return resolve(result as JwtPayloadType);
        }
      });
    });
  }

  async verifyJWTToken(token: string) {
    return await this.verifyToken(token);
  }

  /** Create one CreateJwtTokens to the database. */
  async createJwtTokens(payload: JwtPayloadType): Promise<any> {
    const token = this.createJwtToken('access', payload);
    await this.createRefreshToken(payload);
    return token;
  }
}
