import { ContributorsService } from './../../contributors/contributors.service';
import { ContributorRole } from './../../contributors/contributors.type';
import {
  Controller,
  Post,
  NotFoundException,
  Body,
  Put,
  Param,
  Res,
  Query,
  Get,
  Headers,
  Req,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../../app/utils/reply';
import { useCatch } from '../../../app/utils/use-catch';
import * as amqplib from 'amqplib';
import { UsersService } from '../users.service';
import {
  CreateLoginUserDto,
  CreateRegisterUserDto,
  TokenUserDto,
  UpdateProfileDto,
  UpdateResetPasswordUserDto,
} from '../users.dto';
import { ProfilesService } from '../../profiles/profiles.service';
import { JwtPayloadType } from '../users.type';
import { CheckUserService } from '../middleware/check-user.service';
import { ResetPasswordsService } from '../../reset-passwords/reset-passwords.service';
import { CreateOrUpdateResetPasswordDto } from '../../reset-passwords/reset-passwords.dto';
import { config } from '../../../app/config/index';
import { authCodeConfirmationJob, authPasswordResetJob } from '../users.job';
import { WalletsService } from '../../wallets/wallets.service';
import {
  addYearsFormateDDMMYYDate,
  dateTimeNowUtc,
  generateLongUUID,
  generateNumber,
} from '../../../app/utils/commons';
import { JwtAuthGuard } from '../middleware';
import { OrganizationsService } from '../../organizations/organizations.service';
import {
  expire_cookie_setting,
  validation_code_verification_cookie_setting,
  validation_login_cookie_setting,
} from '../../../app/utils/cookies';
import { GoogleAuthGuard } from '../middleware/google/google-auth.guard';

@Controller()
export class AuthUserController {
  constructor(
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
    private readonly contributorsService: ContributorsService,
    private readonly organizationsService: OrganizationsService,
    private readonly resetPasswordsService: ResetPasswordsService,
  ) {}

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Req() req, @Res() res) {
    return res.redirect('http://localhost:3001/dashboard');
  }

  /** Register new user */
  @Post(`/register`)
  async createOneRegister(@Res() res, @Body() body: CreateRegisterUserDto) {
    const { email, password, firstName, lastName, username } = body;

    const findOnUser = await this.usersService.findOneBy({ email });
    const findOnUserByUsername = await this.usersService.findOneBy({
      username,
    });
    if (findOnUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Profile */
    const profile = await this.profilesService.createOne({
      fullName: `${firstName} ${lastName}`,
      lastName,
      firstName,
    });

    /** Create Organization */
    const organization = await this.organizationsService.createOne({
      name: `${firstName} ${lastName}`,
    });

    /** Create User */
    const usernameGenerate = `${generateLongUUID(8)}`.toLowerCase();
    const user = await this.usersService.createOne({
      email,
      password,
      profileId: profile?.id,
      username: username
        ? findOnUserByUsername
          ? usernameGenerate
          : username
        : usernameGenerate,
      organizationId: organization?.id,
    });

    /** Create Wallet */
    await this.walletsService.createOne({
      organizationId: user?.organizationId,
    });

    /** Create Subscribe */
    await this.contributorsService.createOne({
      userId: user?.id,
      userCreatedId: user?.id,
      role: 'ADMIN',
      organizationId: organization?.id,
    });

    /** Update Organization */
    await this.organizationsService.updateOne(
      { organizationId: organization?.id },
      { userId: user?.id },
    );

    //const queue = 'user-register';
    //const connect = await amqplib.connect(
    //  config.implementations.amqp.link,
    //);
    //const channel = await connect.createChannel();
    //await channel.assertQueue(queue, { durable: false });
    //await channel.sendToQueue(queue, Buffer.from(JSON.stringify(results)));
    //await authRegisterJob({ channel, queue });

    const jwtPayload: JwtPayloadType = {
      id: user.id,
      profileId: user.profileId,
      organizationId: user.organizationId,
    };

    const refreshToken =
      await this.checkUserService.createJwtTokens(jwtPayload);

    return reply({
      res,
      results: { accessToken: `Bearer ${refreshToken}`, id: user.id },
    });
  }

  /** Login user */
  @Post(`/login`)
  async createOneLogin(
    @Res() res,
    @Body() createLoginUserDto: CreateLoginUserDto,
  ) {
    const { email, password } = createLoginUserDto;

    const findOnUser = await this.usersService.findOneBy({ email });
    if (!findOnUser?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const jwtPayload: JwtPayloadType = {
      id: findOnUser.id,
      organizationId: findOnUser.organizationId,
      profileId: findOnUser.profileId,
    };

    const refreshToken =
      await this.checkUserService.createJwtTokens(jwtPayload);

    res.cookie('x-cookies-login', jwtPayload, validation_login_cookie_setting);

    return reply({
      res,
      results: {
        accessToken: `Bearer ${refreshToken}`,
        id: findOnUser.id,
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

    const findOnUser = await this.usersService.findOneBy({ email });
    if (!findOnUser)
      throw new HttpException(
        `Email ${email} dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const jwtPayload: JwtPayloadType = {
      id: findOnUser.id,
      profileId: findOnUser.profileId,
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
  @UseGuards(JwtAuthGuard)
  async updateOneProfile(
    @Res() res,
    @Body() body: UpdateProfileDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const { username, fullName, image, color } = body;

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
        image,
        color,
      },
    );

    await this.usersService.updateOne({ userId }, { username });

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
    const expiresIn = config.cookie_access.user.firstStepExpire;
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
}
