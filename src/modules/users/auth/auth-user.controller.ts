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
} from '@nestjs/common';
import { reply } from '../../../app/utils/reply';
import { useCatch } from '../../../app/utils/use-catch';
import * as amqplib from 'amqplib';
import { UsersService } from '../users.service';
import {
  CreateLoginUserDto,
  CreateRegisterUserDto,
  TokenUserDto,
  UpdateResetPasswordUserDto,
} from '../users.dto';
import { ProfilesService } from '../../profiles/profiles.service';
import { JwtPayloadType } from '../users.type';
import { CheckUserService } from '../middleware/check-user.service';
import { ResetPasswordsService } from '../../reset-passwords/reset-passwords.service';
import { CreateOrUpdateResetPasswordDto } from '../../reset-passwords/reset-passwords.dto';
import { config } from '../../../app/config/index';
import { authLoginJob, authPasswordResetJob } from '../users.job';
import { OrganizationsService } from '../../organizations/organizations.service';
import { WalletsService } from '../../wallets/wallets.service';

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
  async createOneRegister(
    @Res() res,
    @Req() req,
    @Body() createRegisterUserDto: CreateRegisterUserDto,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { email, password, firstName, lastName } = createRegisterUserDto;

    const findOnUser = await this.usersService.findOneBy({ email });
    if (findOnUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Profile */
    const profile = await this.profilesService.createOne({
      firstName,
      lastName,
    });

    /** Create Organization */
    const organization = await this.organizationsService.createOne({
      name: `${firstName} ${lastName}`,
      email,
    });

    /** Create User */
    const user = await this.usersService.createOne({
      email,
      password,
      profileId: profile?.id,
      username: `${firstName}.${lastName}`.toLowerCase(),
      organizationInUtilizationId: organization?.id,
    });

    /** Update Organization */
    await this.organizationsService.updateOne(
      { organizationId: organization?.id },
      { userId: user?.id },
    );

    /** Update User */
    await this.usersService.updateOne(
      { userId: user?.id },
      { organizationInUtilizationId: organization?.id },
    );

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: user?.id,
      userCreatedId: user?.id,
      role: ContributorRole.ADMIN,
      organizationId: organization?.id,
    });

    /** Create Wallet */
    await this.walletsService.createOne({
      userId: user?.id,
    });
    //const queue = 'user-register';
    //const connect = await amqplib.connect(
    //  config.implementations.amqp.link,
    //);
    //const channel = await connect.createChannel();
    //await channel.assertQueue(queue, { durable: false });
    //await channel.sendToQueue(queue, Buffer.from(JSON.stringify(results)));
    //await authRegisterJob({ channel, queue });

    return reply({ res, results: user });
  }

  /** Login user */
  @Post(`/login`)
  async createOneLogin(
    @Res() res,
    @Req() req,
    @Body() createLoginUserDto: CreateLoginUserDto,
  ) {
    const { email, password } = createLoginUserDto;

    const findOnUser = await this.usersService.findOneBy({ email });
    if (!findOnUser?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const jwtPayload: JwtPayloadType = {
      id: findOnUser.id,
      profileId: findOnUser.profileId,
      firstName: findOnUser?.profile?.firstName,
      lastName: findOnUser?.profile?.lastName,
      organizationInUtilizationId: findOnUser.organizationInUtilizationId,
    };

    const refreshToken = await this.checkUserService.createJwtTokens(
      jwtPayload,
    );

    return reply({ res, results: `Bearer ${refreshToken}` });
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
      firstName: findOnUser?.profile?.firstName,
      lastName: findOnUser?.profile?.lastName,
      organizationInUtilizationId: findOnUser.organizationInUtilizationId,
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
}
