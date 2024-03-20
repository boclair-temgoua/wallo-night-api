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
import { TokenJwtModel } from '../check-user.service';

@Injectable()
export class UserVerifyStrategy extends PassportStrategy(
  Strategy,
  config.cookie_access.jwtVerify,
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly contributorsUtil: ContributorsUtil,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        UserVerifyStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.cookieKey,
    });
  }

  private static extractJwt(req: Request): string | null {
    if (
      req.cookies &&
      config.cookie_access.namVerify in req.cookies &&
      req.cookies[config.cookie_access.namVerify].length > 0
    ) {
      const token = req.cookies[config.cookie_access.namVerify];
      const payload = verify(token, config.cookieKey);
      if (!payload)
        throw new HttpException(`Token invalid`, HttpStatus.NOT_FOUND);

      return token;
    }
    return null;
  }

  async validate(payload: TokenJwtModel): Promise<any> {
    const user = await this.usersService.findOneBy({ userId: payload?.userId });
    if (!user) throw new UnauthorizedException('Invalid user');

    /** Check permission contributor */
    const { contributor } =
      await this.contributorsUtil.getAuthorizationToContributor({
        userId: user?.id,
        organizationId: user?.organizationId,
      });
    if (!contributor) throw new UnauthorizedException('Invalid organization');

    return { ...user, contributor };
  }
}
