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
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as amqplib from 'amqplib';
import { config } from '../../../app/config/index';
import { generateLongUUID, generateNumber } from '../../../app/utils/commons';
import { validation_login_cookie_setting } from '../../../app/utils/cookies';
import { reply } from '../../../app/utils/reply';
import { OrganizationsService } from '../../organizations/organizations.service';
import { ProfilesService } from '../../profiles/profiles.service';
import { CreateOrUpdateResetPasswordDto } from '../../reset-passwords/reset-passwords.dto';
import { ResetPasswordsService } from '../../reset-passwords/reset-passwords.service';
import { WalletsService } from '../../wallets/wallets.service';
import { UserAuthGuard } from '../middleware';
import { CheckUserService } from '../middleware/check-user.service';
import {
  CreateLoginUserDto,
  CreateRegisterUserDto,
  TokenUserDto,
  UpdateProfileDto,
  UpdateResetPasswordUserDto,
} from '../users.dto';
import { authCodeConfirmationJob } from '../users.job';
import { UsersService } from '../users.service';
import { JwtPayloadType, checkIfPasswordMatch } from '../users.type';
import { ContributorsService } from './../../contributors/contributors.service';

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

    const findOnUser = await this.usersService.findOneBy({ email });
    if (!(await checkIfPasswordMatch(findOnUser?.password, password))) {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);
    }

    const tokenUser = await this.checkUserService.createToken(
      { id: findOnUser.id, organizationId: findOnUser.organizationId },
      config.cookie_access.accessExpire,
    );

    res.cookie(
      config.cookie_access.name,
      tokenUser,
      validation_login_cookie_setting,
    );

    return reply({
      res,
      results: {
        id: findOnUser.id,
        permission: findOnUser.permission,
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

    // if (!findOnUser)
    //   throw new HttpException(
    //     `Email ${email} dons't exists please change`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // const result = await this.resetPasswordsService.createOne({
    //   email,
    //   accessToken: await this.checkUserService.createJwtTokens(jwtPayload),
    // });

    // /** Send information to Job */
    // const queue = 'user-password-reset';
    // const connect = await amqplib.connect(config.implementations.amqp.link);
    // const channel = await connect.createChannel();
    // await channel.assertQueue(queue, { durable: false });
    // await channel.sendToQueue(queue, Buffer.from(JSON.stringify(result)));
    // await authPasswordResetJob({ channel, queue });
    // /** End send information to Job */

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

    await this.usersService.updateOne({ userId: findOnUser?.id }, { password });

    await this.resetPasswordsService.updateOne(
      { token: findOnResetPassword?.token },
      { deletedAt: new Date() },
    );

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
    // const { cookieKey } = config;
    // const expiresIn = config.cookie_access.user.firstStepExpire;
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
