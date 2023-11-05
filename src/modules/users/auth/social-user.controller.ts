import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { reply } from '../../../app/utils/reply';
import { UsersService } from '../users.service';
import { JwtPayloadType } from '../users.type';
import { CheckUserService } from '../middleware/check-user.service';
import { config } from '../../../app/config/index';
import { generateLongUUID } from '../../../app/utils/commons';
import { OAuth2Client } from 'google-auth-library';
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
      provider: 'google',
    });
    if (!findOnUser)
      throw new HttpException(
        `user dons't exists please`,
        HttpStatus.NOT_FOUND,
      );

    const jwtPayload: JwtPayloadType = {
      id: findOnUser.id,
      organizationId: findOnUser.organizationId,
      profileId: findOnUser.profileId,
    };

    const refreshToken =
      await this.checkUserService.createJwtTokens(jwtPayload);

    return reply({
      res,
      results: {
        id: findOnUser.id,
        nextStep: findOnUser?.nextStep,
        permission: findOnUser.permission,
        accessToken: `Bearer ${refreshToken}`,
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
    const { given_name, family_name, picture, email, email_verified } =
      ticket.getPayload();

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'google',
    });
    if (findOnUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const { user, refreshToken } = await this.usersUtil.saveOrUpdate({
      email,
      provider: 'google',
      email_verified,
      password: generateLongUUID(8),
      firstName: family_name,
      lastName: given_name,
      username: `${given_name}-${family_name}-${generateLongUUID(4)}`,
      image: picture,
    });

    return reply({
      res,
      results: {
        accessToken: `Bearer ${refreshToken}`,
        organizationId: user.organizationId,
      },
    });
  }
}
