import {
  UnauthorizedException,
  NestMiddleware,
  Injectable,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { ApplicationsService } from '../../applications/applications.service';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get('Authorization');
    const token: string = authHeader.split(' ')[1];

    if (!token)
      throw new UnauthorizedException(
        'Invalid token or expired please try later',
      );

    /** Find application token to database */
    const application = await this.applicationsService.findOneBy({
      option2: { token },
    });
    if (!application)
      throw new UnauthorizedException('Application token invalid');

    /** Find user to database */
    const user = await this.usersService.findOneBy({
      option1: { userId: application?.userId },
    });
    if (!user) throw new UnauthorizedException('User invalid');

    console.log('user ======>', user);
    console.log('application ======>', application);
    (req as any).user = { ...user, application };

    next();
  }
}
