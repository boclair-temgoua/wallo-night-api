import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { config } from '../../../app/config';
import { UsersService } from '../users.service';

@Injectable()
export class CheckUserService {
  constructor(private readonly usersService: UsersService) {}

  async createToken(data: JwtPayload, expiry: string) {
    return sign(data, config.cookieKey, { expiresIn: expiry });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return verify(token, config.cookieKey);
    } catch (error) {
      throw new HttpException(
        `Token not valid or expired`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
