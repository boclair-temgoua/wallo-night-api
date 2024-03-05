import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '../../../../app/config';
import { ContributorsUtil } from '../../../contributors/contributors.util';
import { UsersService } from '../../users.service';

export const JwtSecretTMP = 'secretTMP';
@Injectable()
export class UserAuthStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-login',
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly contributorsUtil: ContributorsUtil,
  ) {
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

  async validate(payload): Promise<any> {
    const user = await this.usersService.findOneBy({ userId: payload?.id });
    if (!user) throw new UnauthorizedException('Invalid user');

    /** Check permission contributor */
    const { contributor } =
      await this.contributorsUtil.getAuthorizationToContributor({
        userId: user?.id,
        organizationId: user?.organizationId,
      });
    if (!contributor) throw new UnauthorizedException('Invalid organization');

    return user;
  }
}
