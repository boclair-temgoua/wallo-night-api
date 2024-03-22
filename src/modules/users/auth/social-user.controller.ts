import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../../../app/config/index';
import {
  dateTimeNowUtc,
  generateLongUUID,
  generateNumber,
} from '../../../app/utils/commons';
import { validation_login_cookie_setting } from '../../../app/utils/cookies';
import { reply } from '../../../app/utils/reply';
import { ProvidersService } from '../../providers/providers.service';
import { CheckUserService } from '../middleware/check-user.service';
import { UsersService } from '../users.service';
import { UsersUtil } from '../users.util';

const clientId = config.implementations.google.clientId;
const clientSecret = config.implementations.google.clientSecret;
const client = new OAuth2Client(clientId, clientSecret);

@Controller()
export class SocialUserController {
  constructor(
    private readonly usersUtil: UsersUtil,
    private readonly usersService: UsersService,
    private readonly checkUserService: CheckUserService,
    private readonly providersService: ProvidersService,
  ) {}

  /** Google login new user */
  @Post('/login-google-auth')
  async loginGoogle(@Res() res, @Body('token') token): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, sub } = ticket.getPayload();
    const findOneProvider = await this.providersService.findOneBy({
      name: 'GOOGLE',
      email: email,
    });
    if (!findOneProvider)
      throw new HttpException(
        `User dons't exists please try again`,
        HttpStatus.NOT_FOUND,
      );

    const findOnUser = await this.usersService.findOneBy({
      provider: 'PROVIDER',
      userId: findOneProvider?.userId,
    });

    if (!findOnUser)
      throw new HttpException(
        `user dons't exists please try again`,
        HttpStatus.NOT_FOUND,
      );

    const tokenUser = await this.usersUtil.createTokenLogin({
      userId: findOnUser?.id,
      organizationId: findOnUser?.organizationId,
    });

    res.cookie(
      config.cookie_access.nameLogin,
      tokenUser,
      validation_login_cookie_setting,
    );

    return reply({
      res,
      results: { id: findOnUser.id },
    });
  }

  /** Google register new user */
  @Post('/register-google-auth')
  async registerGoogle(@Res() res, @Body('token') token): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { given_name, family_name, picture, email, email_verified, sub } =
      ticket.getPayload();

    const findOneProvider = await this.providersService.findOneBy({
      name: 'GOOGLE',
      email: email,
    });

    if (findOneProvider)
      throw new HttpException(
        `Email ${findOneProvider?.email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const { user } = await this.usersUtil.saveOrUpdate({
      email,
      role: 'ADMIN',
      provider: 'PROVIDER',
      email_verified,
      password: generateLongUUID(8),
      firstName: family_name,
      lastName: given_name,
      username: `${given_name}-${family_name}-${generateNumber(4)}`,
      image: { id: 'provider', patch: picture },
      confirmedAt: dateTimeNowUtc(),
    });

    await this.providersService.createOne({
      providerId: sub,
      email: user?.email,
      userId: user?.id,
      name: 'GOOGLE',
    });

    return reply({
      res,
      results: { organizationId: user?.id },
    });
  }
}
