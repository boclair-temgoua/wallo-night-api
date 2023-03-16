import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { GetOnUserPublic } from '../users.type';

@Injectable()
export class JwtAuthAdminGuard extends AuthGuard('jwt') {
  handleRequest(
    err: any,
    user: GetOnUserPublic,
    info: any,
    context: any,
    status: any,
  ) {
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException(
        'Invalid token or expired please try again',
      );
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
