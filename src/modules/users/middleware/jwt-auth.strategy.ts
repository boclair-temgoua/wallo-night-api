import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configurations } from '../../../app/configurations';
import {
  UnauthorizedException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { useCatch } from '../../../app/utils/use-catch';
import { User } from '../../../models/User';
import { UsersService } from '../users.service';
import { ContributorsUtil } from '../../contributors/contributors.util';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
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

  async validate(payload): Promise<any> {
    const user = await this.usersService.findOneBy({
      option1: { userId: payload?.id },
    });
    if (!user) throw new UnauthorizedException('Invalid user');

    /** Check permission contributor */
    const { contributorOrganization } =
      await this.contributorsUtil.getAuthorizationToContributor({
        userId: user?.id,
        organizationId: user?.organizationInUtilizationId,
        type: 'ORGANIZATION',
      });
    if (!contributorOrganization) throw new UnauthorizedException();

    return user;
  }
}
