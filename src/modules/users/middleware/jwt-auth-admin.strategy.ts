import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configurations } from '../../../app/configurations';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { ContributorsUtil } from '../../contributors/contributors.util';
import { GetOnUserPublic } from '../users.type';

@Injectable()
export class JwtAuthAdminStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly contributorsUtil: ContributorsUtil,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurations.jwt.secret,
    });
  }

  async validate(payload): Promise<GetOnUserPublic> {
    const user = await this.usersService.findOneInfoBy({
      option1: { userId: payload?.id },
    });
    if (!user) throw new UnauthorizedException('Invalid user');
    /** This condition check if user is ADMIN */
    if (!['ADMIN'].includes(user?.role?.name))
      throw new UnauthorizedException('Not authorized! Change permission');

    /** Check permission contributor */
    const { contributor } =
      await this.contributorsUtil.getAuthorizationToContributor({
        userId: user?.id,
        organizationId: user?.organizationInUtilizationId,
      });
    if (!contributor) throw new UnauthorizedException('Invalid organization');

    return user;
  }
}
