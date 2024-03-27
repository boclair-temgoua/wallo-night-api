import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '../../../../app/config';
import { ContributorsUtil } from '../../../contributors/contributors.util';
import { TokenJwtModel } from '../check-user.service';

@Injectable()
export class UserAuthStrategy extends PassportStrategy(
  Strategy,
  config.cookie_access.jwtUser,
) {
  constructor(private readonly contributorsUtil: ContributorsUtil) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        UserAuthStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.cookieKey,
    });
  }

  private static extractJwt(req: Request): string | null {
    if (
      req.cookies &&
      config.cookie_access.nameLogin in req.cookies &&
      req.cookies[config.cookie_access.nameLogin].length > 0
    ) {
      const token = req.cookies[config.cookie_access.nameLogin];
      const payload = verify(token, config.cookieKey);
      if (!payload)
        throw new HttpException(`Token invalid`, HttpStatus.NOT_FOUND);

      return token;
    }
    return null;
  }

  async validate(payload: TokenJwtModel): Promise<any> {
    const { user, organization, contributor } =
      await this.contributorsUtil.findOneUserAuthorize({
        userId: payload?.userId,
      });
    return { ...user, organization, contributor };
  }
}
