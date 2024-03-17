import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as amqplib from 'amqplib';
import { config } from '../../../app/config/index';
import { getIpRequest } from '../../../app/utils/commons/get-ip-request';
import { validation_login_cookie_setting } from '../../../app/utils/cookies';
import { reply } from '../../../app/utils/reply';
import { getOneLocationIpApi } from '../../integrations/taux-live';
import { ProfilesService } from '../../profiles/profiles.service';
import { CheckUserService } from '../middleware/check-user.service';
import { UserAuthGuard } from '../middleware/cookie/user-auth.guard';
import {
  CreateLoginUserDto,
  CreateOrUpdateResetPasswordDto,
  CreateRegisterUserDto,
  TokenUserDto,
  UpdateProfileDto,
  UpdateResetPasswordUserDto,
} from '../users.dto';
import { authPasswordResetJob } from '../users.job';
import { UsersService } from '../users.service';
import { NextStep, checkIfPasswordMatch } from '../users.type';
import { UsersUtil } from '../users.util';

@Controller()
export class AuthUserController {
  constructor(
    private readonly usersUtil: UsersUtil,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
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

    const { user } = await this.usersUtil.saveOrUpdate({
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
    if (!findOnUser)
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    if (!(await checkIfPasswordMatch(findOnUser?.password, password))) {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);
    }

    const tokenUser = await this.checkUserService.createToken(
      { id: findOnUser.id, organizationId: findOnUser.organizationId },
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

    const tokenUser = await this.checkUserService.createToken(
      { userId: findOnUser.id, organizationId: findOnUser.organizationId },
      config.cookie_access.verifyExpire,
    );

    /** Send information to Job */
    const queue = 'user-password-reset';
    const connect = await amqplib.connect(config.implementations.amqp.link);
    const channel = await connect.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ email, token: tokenUser })),
    );
    await authPasswordResetJob({ channel, queue });
    /** End send information to Job */

    return reply({ res, results: { token: tokenUser } });
  }

  /** Update reset password */
  @Put(`/password/update/:token`)
  async updateOneResetPassword(
    @Res() res,
    @Body() body: UpdateResetPasswordUserDto,
    @Param() params: TokenUserDto,
  ) {
    const { password } = body;
    const payload = await this.checkUserService.verifyToken(params?.token);

    const findOnUser = await this.usersService.findOneBy({
      userId: payload?.id,
      provider: 'default',
    });
    if (!findOnUser)
      throw new HttpException(
        `User already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Check token */
    await this.usersService.updateOne({ userId: findOnUser?.id }, { password });

    return reply({ res, results: 'Password updated successfully' });
  }

  /** Update password */
  @Put(`/profile/update/:userId`)
  @UseGuards(UserAuthGuard)
  async updateOneProfile(
    @Res() res,
    @Body() body: UpdateProfileDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const {
      username,
      description,
      birthday,
      countryId,
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
        description,
        countryId,
        birthday,
        currencyId,
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

    // const codeGenerate = generateNumber(4);
    // const { cookieKey } = config;
    // const expiresIn = config.cookie_access.firstStepExpire;
    // const token = await this.checkUserService.createToken(
    //   { userId: userId, code: codeGenerate, isLogin: true },
    //   cookieKey,
    //   expiresIn,
    // );
    // res.cookie(
    //   'x-code-verification',
    //   token,
    //   validation_code_verification_cookie_setting,
    // );

    // /** Send information to Job */
    // const result = { ...findOnUser, code: codeGenerate };
    // const queue = 'user-send-code';
    // const connect = await amqplib.connect(config.implementations.amqp.link);
    // const channel = await connect.createChannel();
    // await channel.assertQueue(queue, { durable: false });
    // await channel.sendToQueue(queue, Buffer.from(JSON.stringify(result)));
    // await authCodeConfirmationJob({ channel, queue });
    /** End send information to Job */
    return reply({ res, results: 'Email send successfully' });
  }

  /** Resend code user */
  @Post(`/valid/code`)
  @UseGuards(UserAuthGuard)
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

    // const payload = await this.checkUserService.verifyTokenCookie(
    //   req.cookies['x-code-verification'],
    // );

    // if (Number(payload?.code) !== Number(code)) {
    //   throw new HttpException(
    //     `Code ${code} not valid or expired`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    // await this.usersService.updateOne(
    //   { userId: payload?.userId },
    //   { nextStep, confirmedAt: dateTimeNowUtc() },
    // );

    // res.clearCookie('x-code-verification', expire_cookie_setting);

    return reply({ res, results: 'Email confirmed successfully' });
  }

  /** IpLocation new user */
  @Get(`/ip-location`)
  async ipLocation(@Res() res, @Req() req) {
    const ipLocation = await getOneLocationIpApi({
      ipLocation: getIpRequest(req) ?? '101.56.0.0',
    });
    const { continent, country, countryCode, timezone, query, currency } =
      ipLocation;

    return reply({
      res,
      results: {
        continent,
        country,
        countryCode,
        timezone,
        query,
        currency,
      },
    });
  }

  /** Verify token new user */
  @Get(`/verify-token`)
  async verifyToken(@Res() res, @Req() req, @Query('token') token: string) {
    const payload = await this.checkUserService.verifyToken(token);

    console.log('payload ===>', payload);

    return reply({
      res,
      results: payload,
    });
  }

  /** Logout user */
  @Get(`/logout`)
  async logout(@Res() res, @Req() req) {
    res.clearCookie(
      config.cookie_access.nameLogin,
      validation_login_cookie_setting,
    );
    res.clearCookie(
      config.cookie_access.namVerify,
      validation_login_cookie_setting,
    );

    return reply({ res, results: 'User logout successfully' });
  }
}
