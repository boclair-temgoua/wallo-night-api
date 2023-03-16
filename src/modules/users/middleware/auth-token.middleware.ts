import {
  UnauthorizedException,
  NotFoundException,
  NestMiddleware,
  Injectable,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { useCatch } from '../../../app/utils/use-catch';
import { UsersService } from '../users.service';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get('Authorization');
    const token: string = authHeader.split(' ')[1];

    if (!token)
      throw new UnauthorizedException(
        'Invalid token or expired please try later',
      );

    /** Find application token to database */
    //const [_error, applicationToken] = await useCatch(
    //  this.findOneApplicationTokenByService.findOneBy({ option2: { token } }),
    //);
    //if (_error) {
    //  throw new NotFoundException(_error);
    //}
    //if (!applicationToken)
    //  throw new UnauthorizedException('Application token invalid');

    /** Find user to database */
    const [_errorU, user] = await useCatch(
      this.usersService.findOneBy({
        option1: { userId: '' },
      }),
    );
    if (_errorU) {
      throw new NotFoundException(_errorU);
    }
    if (!user) throw new UnauthorizedException('User invalid');

    (req as any).user = { ...user };

    next();
  }
}
