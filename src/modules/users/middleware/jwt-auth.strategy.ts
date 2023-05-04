import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configurations } from '../../../app/configurations';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurations.jwt.secret,
    });
  }

  async validate(payload): Promise<any> {
    const user = await this.usersService.findOneBy({ userId: payload?.id });
    if (!user) throw new UnauthorizedException('Invalid user');

    return user;
  }
}
