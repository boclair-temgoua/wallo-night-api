import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as amqplib from 'amqplib';
import { config } from '../../../app/config/index';
import { dateTimeNowUtc, generateNumber } from '../../../app/utils/commons';
import {
  expire_cookie_setting,
  validation_code_verification_cookie_setting,
  validation_login_cookie_setting,
} from '../../../app/utils/cookies';
import { reply } from '../../../app/utils/reply';
import { ProfilesService } from '../../profiles/profiles.service';
import { CreateOrUpdateResetPasswordDto } from '../../reset-passwords/reset-passwords.dto';
import { ResetPasswordsService } from '../../reset-passwords/reset-passwords.service';
import { CheckUserService } from '../middleware/check-user.service';
import { CookieAuthGuard } from '../middleware/cookie/cookie-auth.guard';
import {
  CreateLoginUserDto,
  CreateRegisterUserDto,
  TokenUserDto,
  UpdateProfileDto,
  UpdateResetPasswordUserDto,
} from '../users.dto';
import { authCodeConfirmationJob, authPasswordResetJob } from '../users.job';
import { UsersService } from '../users.service';
import { JwtPayloadType, NextStep, checkIfPasswordMatch } from '../users.type';
import { UsersUtil } from '../users.util';

@Controller()
export class AuthUserController {
  constructor(
    private readonly usersUtil: UsersUtil,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
    private readonly resetPasswordsService: ResetPasswordsService,
  ) {}

  /** Register new user */
  @Post(`/register`)
  async createOneRegister(@Res() res, @Body() body: CreateRegisterUserDto) {
    const { email, password, firstName, lastName, username } = body;

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'default',
    });
    if (findOnUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const { user, refreshToken } = await this.usersUtil.saveOrUpdate({
      email,
      password,
      firstName,
      lastName,
      username,
      provider: 'default',
    });

    return reply({
      res,
      results: {
        accessToken: `Bearer ${refreshToken}`,
        organizationId: user.organizationId,
      },
    });
  }

  /** Login user */
  @Post(`/login`)
  async createOneLogin(
    @Res() res,
    @Body() createLoginUserDto: CreateLoginUserDto,
  ) {
    const { email, password } = createLoginUserDto;

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'default',
    });
    if (!(await checkIfPasswordMatch(findOnUser?.password, password))) {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);
    }

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
        organizationId: findOnUser.organizationId,
      },
    });
  }

  /** Reset password */
  @Post(`/password/reset`)
  async createOneResetPassword(
    @Res() res,
    @Body() body: CreateOrUpdateResetPasswordDto,
  ) {
    const { email } = body;

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'default',
    });
    if (!findOnUser)
      throw new HttpException(
        `Email ${email} dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const jwtPayload: JwtPayloadType = {
      id: findOnUser.id,
      organizationId: findOnUser.organizationId,
    };

    if (!findOnUser)
      throw new HttpException(
        `Email ${email} dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    const result = await this.resetPasswordsService.createOne({
      email,
      accessToken: await this.checkUserService.createJwtTokens(jwtPayload),
    });

    /** Send information to Job */
    const queue = 'user-password-reset';
    const connect = await amqplib.connect(config.implementations.amqp.link);
    const channel = await connect.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(result)));
    await authPasswordResetJob({ channel, queue });
    /** End send information to Job */

    return reply({ res, results: 'Email reset password send successfully' });
  }

  /** Update reset password */
  @Put(`/password/update/:token`)
  async updateOneResetPassword(
    @Res() res,
    @Body() body: UpdateResetPasswordUserDto,
    @Param() params: TokenUserDto,
  ) {
    const { password } = body;

    const findOnResetPassword = await this.resetPasswordsService.findOneBy({
      token: params?.token,
    });
    if (!findOnResetPassword) {
      throw new UnauthorizedException('Invalid user please change');
    }

    const findOnUser = await this.usersService.findOneBy({
      email: findOnResetPassword?.email,
    });
    if (!findOnUser)
      throw new HttpException(
        `User already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Check token */
    await this.checkUserService.verifyJWTToken(
      findOnResetPassword?.accessToken,
    );

    await this.usersService.updateOne({ userId: findOnUser?.id }, { password });

    await this.resetPasswordsService.updateOne(
      { token: findOnResetPassword?.token },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Password updated successfully' });
  }

  /** Update password */
  @Put(`/profile/update/:userId`)
  @UseGuards(CookieAuthGuard)
  async updateOneProfile(
    @Res() res,
    @Body() body: UpdateProfileDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const {
      username,
      fullName,
      description,
      birthday,
      countryId,
      image,
      color,
      url,
      currencyId,
      nextStep,
    } = body;

    const findOnUser = await this.usersService.findOneBy({ userId });
    if (!findOnUser)
      throw new HttpException(
        `User ${userId} dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOnUserUsername = await this.usersService.findOneBy({ username });

    if (
      findOnUserUsername &&
      findOnUserUsername?.username !== findOnUser?.username
    )
      throw new HttpException(
        `${username} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.profilesService.updateOne(
      { profileId: findOnUser?.profileId },
      {
        fullName,
        description,
        countryId,
        birthday,
        currencyId,
        image,
        color,
        url,
      },
    );

    await this.usersService.updateOne({ userId }, { nextStep, username });

    return reply({ res, results: 'Profile updated successfully' });
  }

  /** Resend code user */
  @Get(`/resend/code/:userId`)
  async resendCode(@Res() res, @Param('userId', ParseUUIDPipe) userId: string) {
    const findOnUser = await this.usersService.findOneBy({ userId });
    if (!findOnUser)
      throw new HttpException(
        `User ${userId} dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const codeGenerate = generateNumber(4);
    const { cookieKey } = config;
    const expiresIn = config.cookie_access.firstStepExpire;
    const token = await this.checkUserService.createToken(
      { userId: userId, code: codeGenerate, isLogin: true },
      cookieKey,
      expiresIn,
    );
    res.cookie(
      'x-code-verification',
      token,
      validation_code_verification_cookie_setting,
    );

    /** Send information to Job */
    const result = { ...findOnUser, code: codeGenerate };
    const queue = 'user-send-code';
    const connect = await amqplib.connect(config.implementations.amqp.link);
    const channel = await connect.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(result)));
    await authCodeConfirmationJob({ channel, queue });
    /** End send information to Job */

    return reply({ res, results: 'Email send successfully' });
  }

  /** Resend code user */
  @Post(`/valid/code`)
  @UseGuards(CookieAuthGuard)
  async validCode(
    @Res() res,
    @Req() req,
    @Body('code') code: string,
    @Body('nextStep') nextStep: NextStep,
  ) {
    if (!req.cookies['x-code-verification'])
      throw new HttpException(
        `Code ${code} not valid or expired`,
        HttpStatus.NOT_FOUND,
      );

    const payload = await this.checkUserService.verifyTokenCookie(
      req.cookies['x-code-verification'],
    );

    if (Number(payload?.code) !== Number(code)) {
      throw new HttpException(
        `Code ${code} not valid or expired`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.usersService.updateOne(
      { userId: payload?.userId },
      { nextStep, confirmedAt: dateTimeNowUtc() },
    );

    res.clearCookie('x-code-verification', expire_cookie_setting);

    return reply({ res, results: 'Email confirmed successfully' });
  }

  /** Logout user */
  @Delete(`/logout`)
  async logout(@Res() res, @Req() req) {
    if (!req.cookies[config.cookie_access.nameLogin])
      throw new HttpException(
        `Not valid token or expired`,
        HttpStatus.NOT_FOUND,
      );

    res.clearCookie(config.cookie_access.nameLogin, expire_cookie_setting);

    return reply({ res, results: 'User logout successfully' });
  }
}
