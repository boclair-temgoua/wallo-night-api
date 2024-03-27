import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { FileInterceptor } from '@nestjs/platform-express';
import { config } from '../../app/config';
import { dateTimeNowUtc } from '../../app/utils/commons';
import { validation_login_cookie_setting } from '../../app/utils/cookies';
import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { ContributorsService } from '../contributors/contributors.service';
import { ProfilesService } from '../profiles/profiles.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { UserAuthGuard } from './middleware';
import {
  GetOneUserDto,
  UpdateEnableProfileDto,
  UpdateOneEmailUserDto,
  UpdateProfileDto,
  UpdateResetPasswordUserDto,
} from './users.dto';
import { UsersService } from './users.service';
import { checkIfPasswordMatch } from './users.type';

@Controller('users')
export class UsersController {
  constructor(
    private readonly uploadsUtil: UploadsUtil,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly contributorsService: ContributorsService,
  ) {}

  /** Get all users */
  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAllUsers(
    @Res() res,
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const users = await this.usersService.findAll({
      search,
      pagination,
    });

    return reply({ res, results: users });
  }

  @Get(`/view`)
  async getOneByIdUserPublic(@Res() res, @Query() query: GetOneUserDto) {
    const { userId, username, userVisitorId } = query;

    const findOneUser = await this.usersService.findOnePublicBy({
      userId,
      username,
      followerId: userVisitorId,
    });

    if (!findOneUser)
      throw new HttpException(
        `User ${userId || username} not valid please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({
      res,
      results: findOneUser,
    });
  }

  @Get(`/me`)
  @UseGuards(UserAuthGuard)
  async getMe(@Res() res, @Req() req) {
    const { user } = req;
    const findOneUser = await this.usersService.findOneInfoBy({
      userId: user?.id,
    });
    if (!findOneUser) throw new UnauthorizedException('Invalid user');

    return reply({
      res,
      results: { ...findOneUser, role: user?.contributor?.role },
    });
  }

  @Get(`/profile/show/:profileId`)
  @UseGuards(UserAuthGuard)
  async getOneByProfileId(
    @Res() res,
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    const profile = await this.profilesService.findOneBy({
      profileId,
    });

    return reply({ res, results: profile });
  }

  @Put(`/update/profile`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor('attachment'))
  async updateProfile(
    @Res() res,
    @Req() req,
    @Body() body: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const {
      username,
      countryId,
      currencyId,
      firstName,
      lastName,
      color,
      url,
      birthday,
      phone,
      firstAddress,
      secondAddress,
      description,
    } = body;

    const findOneUser = await this.usersService.findOneBy({ username });
    if (findOneUser && findOneUser?.username !== user?.username)
      throw new HttpException(
        `Username ${username} already take please change`,
        HttpStatus.NOT_FOUND,
      );

    const { fileName } = await this.uploadsUtil.uploadOneAWS({
      profileId: user?.profile?.id,
      userId: user?.id,
      uploadableId: user?.profile?.id,
      model: 'PROFILE',
      folder: 'profiles',
      file: file,
      organizationId: user?.organizationId,
    });

    await this.profilesService.updateOne(
      { profileId: user?.profile?.id },
      {
        countryId,
        currencyId,
        firstName,
        lastName,
        color,
        url,
        birthday,
        phone,
        firstAddress,
        secondAddress,
        description,
        image: fileName && { key: 'aws', patch: fileName },
      },
    );

    if (username) {
      await this.usersService.updateOne({ userId: user?.id }, { username });
    }

    return reply({ res, results: 'Profile updated successfully' });
  }

  @Put(`/update/enable/:profileId`)
  @UseGuards(UserAuthGuard)
  async updateEnableProfile(
    @Res() res,
    @Req() req,
    @Query() query: UpdateEnableProfileDto,
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    const { enableGallery, enableShop, enableCommission } = query;
    const findOneProfile = await this.profilesService.findOneBy({
      profileId,
    });

    if (!findOneProfile)
      throw new HttpException(
        `profile ${profileId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    await this.profilesService.updateOne(
      { profileId: findOneProfile.id },
      {
        enableGallery: enableGallery && !findOneProfile?.enableGallery,
        enableShop: enableShop && !findOneProfile?.enableShop,
        enableCommission: enableCommission && !findOneProfile?.enableCommission,
      },
    );

    return reply({ res, results: 'profile updated successfully' });
  }

  @Put(`/update-password`)
  @UseGuards(UserAuthGuard)
  async updateUserPassword(
    @Res() res,
    @Req() req,
    @Body() body: UpdateResetPasswordUserDto,
  ) {
    const { user } = req;
    const { password, oldPassword } = body;

    if (!(await checkIfPasswordMatch(user?.password, oldPassword))) {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      throw new HttpException(`Invalid password`, HttpStatus.NOT_FOUND);
    }

    await this.usersService.updateOne({ userId: user?.id }, { password });

    return reply({ res, results: 'User updated successfully' });
  }

  @Put(`/change-email`)
  @UseGuards(UserAuthGuard)
  async updateUserEmail(
    @Res() res,
    @Req() req,
    @Body() body: UpdateOneEmailUserDto,
  ) {
    const { user } = req;
    const { email, password } = body;
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const findOneUser = await this.usersService.findOneBy({ email });

    if (findOneUser && findOneUser?.email !== user?.email)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.usersService.updateOne({ userId: user?.id }, { email: email });

    return reply({ res, results: 'User updated successfully' });
  }

  @Delete(`/:userId`)
  @UseGuards(UserAuthGuard)
  async deleteOnUser(
    @Res() res,
    @Req() req,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const { user } = req;
    const findOneUser = await this.usersService.findOneBy({
      userId,
    });

    if (!findOneUser && userId !== user?.id)
      throw new HttpException(
        `User ${userId} already not exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.usersService.updateOne(
      { userId },
      { deletedAt: dateTimeNowUtc() },
    );

    res.clearCookie(
      config.cookie_access.nameLogin,
      validation_login_cookie_setting,
    );

    return reply({ res, results: 'User deleted successfully' });
  }
}
