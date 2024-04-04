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
import { config } from '../../../app/config';
import {
  dateTimeNowUtc,
  generateNumber,
  getIpRequest,
} from '../../../app/utils/commons';
import {
  validation_login_cookie_setting,
  validation_verify_cookie_setting,
} from '../../../app/utils/cookies';
import { reply } from '../../../app/utils/reply';
import { ContributorsService } from '../../contributors/contributors.service';
import { ContributorsUtil } from '../../contributors/contributors.util';
import { getOneLocationIpApi } from '../../integrations/taux-live';
import { otpMessageSend, otpVerifySid } from '../../integrations/twilio-otp';
import { ProfilesService } from '../../profiles/profiles.service';
import {
  CheckUserService,
  TokenJwtModel,
} from '../middleware/check-user.service';
import { Cookies } from '../middleware/cookie.guard';
import { UserAuthGuard } from '../middleware/cookie/user-auth.guard';
import { UserVerifyAuthGuard } from '../middleware/cookie/user-verify-auth.guard';
import {
  CheckEmailOrPhoneUserDto,
  CreateLoginUserDto,
  CreateRegisterUserDto,
  LoginPhoneUserDto,
  PasswordResetDto,
  PasswordUpdatedDto,
  SendCodeEmailUserDto,
  SendCodePhoneUserDto,
  TokenUserDto,
  UpdateProfileDto,
} from '../users.dto';
import { codeConfirmationJob, passwordResetJob } from '../users.job';
import { UsersService } from '../users.service';
import { checkIfPasswordMatch } from '../users.type';
import { UsersUtil } from '../users.util';

@Controller()
export class AuthUserController {
  constructor(
    private readonly usersUtil: UsersUtil,
    private readonly usersService: UsersService,
    private readonly contributorsUtil: ContributorsUtil,
    private readonly contributorsService: ContributorsService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
  ) {}

  /** Register new user */
  @Post(`/register`)
  async createOneRegister(
    @Res() res,
    @Cookies() cookies,
    @Body() body: CreateRegisterUserDto,
  ) {
    const { email, password, firstName, code, phone, lastName } = body;

    if (phone && code) {
      const findOnUserPhone = await this.usersService.findOneBy({
        phone,
        provider: 'DEFAULT',
      });
      if (findOnUserPhone?.phoneConfirmedAt) {
        throw new HttpException(
          `This phone number ${phone} is associated to an account`,
          HttpStatus.NOT_FOUND,
        );
      }

      const otpMessageVerifySid = await otpVerifySid({
        phone: phone,
        code: code,
      });
      if (!otpMessageVerifySid?.valid) {
        throw new HttpException(
          `6-digit code invalid resend another`,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (email && code) {
      const findOnUserEmail = await this.usersService.findOneBy({
        email,
        provider: 'DEFAULT',
      });
      if (findOnUserEmail)
        throw new HttpException(
          `Email ${email} already exists please change`,
          HttpStatus.NOT_FOUND,
        );
      const token = cookies[config.cookie_access.namVerify];
      if (!token) {
        throw new HttpException(
          `Token invalid or expired`,
          HttpStatus.NOT_FOUND,
        );
      }
      const payload = await this.checkUserService.verifyToken(token);
      if (payload?.code !== code && payload?.email !== email) {
        throw new HttpException(
          `Code invalid or expired try to resend code`,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const { user } = await this.usersUtil.saveOrUpdate({
      email,
      password,
      firstName,
      lastName,
      username: `${firstName}-${lastName}-${generateNumber(4)}`,
      provider: 'DEFAULT',
      role: 'ADMIN',
      phone,
      confirmedAt: dateTimeNowUtc(),
    });

    const tokenUser = await this.usersUtil.createTokenLogin({
      userId: user?.id,
      organizationId: user?.organizationId,
    });

    res.cookie(
      config.cookie_access.nameLogin,
      tokenUser,
      validation_login_cookie_setting,
    );

    res.clearCookie(
      config.cookie_access.namVerify,
      validation_verify_cookie_setting,
    );

    return reply({ res, results: 'User signed in successfully' });
  }

  /** Login user */
  @Post(`/check-email-or-phone`)
  async checkEmailOrPhone(@Res() res, @Body() body: CheckEmailOrPhoneUserDto) {
    const { email, phone } = body;

    const findOnUser = await this.usersService.findOneBy({
      phone,
      email,
      provider: 'DEFAULT',
    });

    if (phone) {
      if (!findOnUser && !findOnUser?.phoneConfirmedAt) {
        throw new HttpException(
          `This phone number not associate to the account`,
          HttpStatus.NOT_FOUND,
        );
      }

      const otpMessageVoce = await otpMessageSend({ phone });
      if (!otpMessageVoce) {
        throw new HttpException(
          `OTP message voce invalid`,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (email && !findOnUser) {
      throw new HttpException(
        `This email not associate to the account`,
        HttpStatus.NOT_FOUND,
      );
    }

    return reply({
      res,
      results: { email: findOnUser?.email, phone: findOnUser?.phone },
    });
  }

  /** Login user */
  @Post(`/login`)
  async createOneLogin(@Res() res, @Body() body: CreateLoginUserDto) {
    const { email, password } = body;

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'DEFAULT',
    });
    if (!findOnUser)
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const findOnContributor = await this.contributorsService.findOneBy({
      userId: findOnUser.id,
      organizationId: findOnUser.organizationId,
    });
    if (!findOnContributor)
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    if (!(await checkIfPasswordMatch(findOnUser?.password, password))) {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);
    }

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
      results: {
        id: findOnUser?.id,
        confirmedAt: findOnUser?.confirmedAt,
        organizationId: findOnUser?.organizationId,
        phoneConfirmedAt: findOnUser?.phoneConfirmedAt,
        emailConfirmedAt: findOnUser?.emailConfirmedAt,
      },
    });
  }

  /** Send Code login email */
  @Get(`/send-code-email/:email`)
  async sendCodeEmailOne(@Res() res, @Param() param: SendCodeEmailUserDto) {
    const { email } = param;
    const codeGenerate = generateNumber(6);
    const tokenVerify = await this.checkUserService.createToken(
      { code: codeGenerate, email },
      config.cookie_access.accessExpire,
    );

    res.cookie(
      config.cookie_access.namVerify,
      tokenVerify,
      validation_verify_cookie_setting,
    );

    await codeConfirmationJob({
      email: email,
      code: codeGenerate,
    });

    return reply({ res, results: 'Email send code successfully' });
  }

  /** Send Code login phone */
  @Get(`/send-code-phone/:phone`)
  async sendCodePhoneOne(@Res() res, @Param() param: SendCodePhoneUserDto) {
    const { phone } = param;

    const otpMessageVoce = await otpMessageSend({ phone });
    if (!otpMessageVoce) {
      throw new HttpException(`OTP message voce invalid`, HttpStatus.NOT_FOUND);
    }

    return reply({ res, results: 'OTP send successfully' });
  }

  /** Login phone */
  @Post(`/login-phone`)
  async createOneLoginPhone(@Res() res, @Body() body: LoginPhoneUserDto) {
    const { phone, code } = body;

    const findOnUserPhone = await this.usersService.findOneBy({
      phone,
      provider: 'DEFAULT',
    });
    if (!findOnUserPhone?.phoneConfirmedAt)
      throw new HttpException(
        `This phone number not associate to the account`,
        HttpStatus.NOT_FOUND,
      );

    const otpMessageVerifySid = await otpVerifySid({
      phone: phone,
      code: code,
    });
    if (!otpMessageVerifySid?.valid) {
      throw new HttpException(
        `6-digit code invalid resend another`,
        HttpStatus.NOT_FOUND,
      );
    }

    const tokenUser = await this.usersUtil.createTokenLogin({
      userId: findOnUserPhone?.id,
      organizationId: findOnUserPhone?.organizationId,
    });

    res.cookie(
      config.cookie_access.nameLogin,
      tokenUser,
      validation_login_cookie_setting,
    );

    return reply({ res, results: 'OTP send successfully' });
  }

  /** Reset password */
  @Post(`/password/reset`)
  async createOneResetPassword(@Res() res, @Body() body: PasswordResetDto) {
    const { email } = body;

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'DEFAULT',
    });
    if (!findOnUser)
      throw new HttpException(
        `Email ${email} dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const tokenUser = await this.checkUserService.createToken(
      {
        userId: findOnUser.id,
        organizationId: findOnUser.organizationId,
      } as TokenJwtModel,
      config.cookie_access.verifyExpire,
    );

    /** Send information to Job */
    await passwordResetJob({ email, token: tokenUser });

    return reply({ res, results: { token: tokenUser } });
  }

  /** Update reset password */
  @Put(`/password/update/:token`)
  async updateOneResetPassword(
    @Res() res,
    @Body() body: PasswordUpdatedDto,
    @Param() params: TokenUserDto,
  ) {
    const { password } = body;
    const payload = await this.checkUserService.verifyToken(params?.token);

    const findOnUser = await this.usersService.findOneBy({
      userId: payload?.userId,
      provider: 'DEFAULT',
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

    await this.usersService.updateOne({ userId }, { username });

    return reply({ res, results: 'Profile updated successfully' });
  }

  /** Resend code user */
  @Get(`/resend/code`)
  @UseGuards(UserVerifyAuthGuard)
  async resendCode(@Res() res, @Req() req, @Cookies() cookies) {
    const token = cookies[config.cookie_access.namVerify];
    if (!token) {
      throw new HttpException(`Token invalid or expired`, HttpStatus.NOT_FOUND);
    }
    const payload = await this.checkUserService.verifyToken(token);
    const findOnUser = await this.usersService.findOneBy({
      userId: payload?.userId,
    });
    if (!findOnUser)
      throw new HttpException(
        `User dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const codeGenerate = generateNumber(6);
    const tokenVerify = await this.checkUserService.createToken(
      {
        code: codeGenerate,
        userId: payload.userId,
        organizationId: payload.organizationId,
      } as TokenJwtModel,
      config.cookie_access.accessExpire,
    );
    res.cookie(
      config.cookie_access.namVerify,
      tokenVerify,
      validation_verify_cookie_setting,
    );
    /** Send information to Job */
    await codeConfirmationJob({
      email: findOnUser?.email,
      code: codeGenerate,
    });

    return reply({ res, results: 'Email send successfully' });
  }

  /** Resend code user */
  @Post(`/valid/code`)
  @UseGuards(UserVerifyAuthGuard)
  async validCode(@Res() res, @Body('code') code: string, @Cookies() cookies) {
    const token = cookies[config.cookie_access.namVerify];
    if (!token) {
      throw new HttpException(`Token invalid or expired`, HttpStatus.NOT_FOUND);
    }
    const payload = await this.checkUserService.verifyToken(token);
    if (Number(payload?.code) !== Number(code)) {
      throw new HttpException(
        `Code ${code} invalid or expired try to resend`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { user, contributor } =
      await this.contributorsUtil.findOneUserOrganizationContributor({
        userId: payload.userId,
      });

    await this.usersService.updateOne(
      { userId: user.id },
      { confirmedAt: dateTimeNowUtc() },
    );

    // Update contributor
    await this.contributorsService.updateOne(
      { contributorId: contributor?.id },
      { confirmedAt: dateTimeNowUtc() },
    );

    res.clearCookie(
      config.cookie_access.namVerify,
      validation_verify_cookie_setting,
    );

    const tokenUser = await this.usersUtil.createTokenLogin({
      userId: payload.userId,
      organizationId: payload.organizationId,
    });
    res.cookie(
      config.cookie_access.nameLogin,
      tokenUser,
      validation_login_cookie_setting,
    );

    return reply({ res, results: 'Email confirmed successfully' });
  }

  /** IpLocation new user */
  @Get(`/ip-location`)
  async ipLocation(@Res() res, @Req() req) {
    const ip = await getOneLocationIpApi({
      ipLocation: getIpRequest(req) ?? '101.56.0.0',
    });
    const {
      continent,
      country,
      countryCode,
      continentCode,
      timezone,
      query,
      currency,
    } = ip;

    return reply({
      res,
      results: {
        continent,
        country,
        countryCode,
        timezone,
        query,
        continentCode,
        currency,
      },
    });
  }

  /** Verify token new user */
  @Get(`/verify-token`)
  async verifyToken(@Res() res, @Req() req, @Query('token') token: string) {
    const payload = await this.checkUserService.verifyToken(token);

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
      validation_verify_cookie_setting,
    );

    return reply({ res, results: 'User logout successfully' });
  }
}
