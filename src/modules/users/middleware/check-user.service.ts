import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { config } from '../../../app/config';

export type TokenJwtModel = {
  userId: string;
  code: string;
  organizationId: string;
};
@Injectable()
export class CheckUserService {
  constructor() {}

  async createToken(data: JwtPayload, expiry: string) {
    return sign(data, config.cookieKey, { expiresIn: expiry });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const payload = verify(token, config.cookieKey);

    if (typeof payload == 'string')
      throw new HttpException(`Token invalid or expired`, HttpStatus.NOT_FOUND);

    return payload;
  }
}
