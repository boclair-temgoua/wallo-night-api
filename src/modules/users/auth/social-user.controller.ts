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
import { generateLongUUID, generateNumber } from '../../../app/utils/commons';
import { validation_login_cookie_setting } from '../../../app/utils/cookies';
import { reply } from '../../../app/utils/reply';
import { AuthProvidersService } from '../../auth-providers/auth-providers.service';
import { CheckUserService } from '../middleware/check-user.service';
import { UsersService } from '../users.service';
import { JwtPayloadType } from '../users.type';
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
    private readonly authProvidersService: AuthProvidersService,
  ) {}

  /** Google login new user */
  @Post('/login-google-auth')
  async loginGoogle(@Res() res, @Body('token') token): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'provider',
    });
    if (!findOnUser)
      throw new HttpException(
        `user dons't exists please try again`,
        HttpStatus.NOT_FOUND,
      );

    const jwtPayload: JwtPayloadType = {
      id: findOnUser.id,
      organizationId: findOnUser.organizationId,
    };

    const tokenUser = await this.checkUserService.createTokenCookie(
      jwtPayload,
      config.cookie_access.accessExpire,
    );

    res.cookie(
      config.cookie_access.nameLogin,
      tokenUser,
      validation_login_cookie_setting,
    );

    return reply({
      res,
      results: {
        id: findOnUser.id,
        nextStep: findOnUser?.nextStep,
        permission: findOnUser.permission,
        accessToken: `Bearer ${tokenUser}`,
        organizationId: findOnUser.organizationId,
      },
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

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'provider',
    });
    if (findOnUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const { user } = await this.usersUtil.saveOrUpdate({
      email,
      provider: 'provider',
      email_verified,
      password: generateLongUUID(8),
      firstName: family_name,
      lastName: given_name,
      username: `${given_name}-${family_name}-${generateNumber(6)}`,
      image: picture,
    });

    await this.authProvidersService.createOne({
      providerId: sub,
      email: user?.email,
      userId: user?.id,
      name: 'google',
    });

    return reply({
      res,
      results: {
        organizationId: user.organizationId,
      },
    });
  }
}
