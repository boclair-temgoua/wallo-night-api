import { Injectable, NotFoundException } from '@nestjs/common';
import { useCatch } from '../../../app/utils/use-catch';
import { sign, verify } from 'jsonwebtoken';
import { config } from '../../../app/config';
import { UsersService } from '../users.service';
import { JwtPayloadType } from '../users.type';

@Injectable()
export class CheckUserService {
  constructor(private readonly usersService: UsersService) {}

  async createRefreshToken(payload: JwtPayloadType) {
    const user = await this.usersService.findOneBy({
      userId: `${payload?.id}`,
    });

    const refreshToken = await this.createJwtToken('refresh', payload);
    if (!user.refreshToken) {
      await this.usersService.updateOne(
        { userId: `${payload?.id}` },
        { refreshToken: [refreshToken] },
      );
    } else {
      await this.usersService.updateOne(
        { userId: `${payload?.id}` },
        { refreshToken: [...user.refreshToken, refreshToken] },
      );
    }

    return refreshToken;
  }

  /** Create one createJwtToken for use and save to the database. */
  async createJwtToken(type: 'access' | 'refresh', payload: JwtPayloadType) {
    const secret =
      type === 'access'
        ? config.jwt.secret
        : config.jwt.refreshSecret;
    const expiresIn =
      type === 'access'
        ? config.jwt.expiration
        : config.jwt.refreshExpiration;

    return sign(payload, secret, { expiresIn });
  }

  async verifyToken(token: string) {
    const secret = config.jwt.secret;
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
