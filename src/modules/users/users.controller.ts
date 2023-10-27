import {
  Controller,
  Param,
  Res,
  Query,
  Get,
  ParseUUIDPipe,
  UseGuards,
  HttpException,
  HttpStatus,
  Body,
  Req,
  Put,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { UsersService } from './users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { JwtAuthGuard } from './middleware';
import {
  RequestPaginationDto,
  addPagination,
  PaginationType,
} from '../../app/utils/pagination';
import { FilterQueryType, SearchQueryDto } from '../../app/utils/search-query';
import {
  GetOneUserDto,
  UpdateEnableProfileDto,
  UpdateOneEmailUserDto,
  UpdateProfileDto,
} from './users.dto';
import { ContributorsService } from '../contributors/contributors.service';
import { Cookies } from './middleware/cookie.guard';
import { query } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly contributorsService: ContributorsService,
  ) {}

  /** Get all users */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllUsers(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const users = await this.usersService.findAll({
      search,
      pagination,
      userId: user?.id,
    });

    return reply({ res, results: users });
  }

  /** Get one user */
  @Get(`/show/:userId`)
  // @UseGuards(JwtAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const user = await this.usersService.findOneInfoBy({ userId });

    const getOneContributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      type: 'ORGANIZATION',
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this organization ${userId} please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({
      res,
      results: { ...user, role: getOneContributor?.role },
    });
  }

  @Get(`/view`)
  async getOneByIdUserPublic(
    @Res() res,
    @Query() query: GetOneUserDto,
    @Cookies('x-cookies-login') user: any,
  ) {
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

  // @Get(`/statistic/:userId`)
  // async getOneByIdUserStatistic(
  //   @Res() res,
  //   @Param('userId', ParseUUIDPipe) userId: string,
  // ) {
  //   const findOneUser = await this.usersService.findOneStatistic({
  //     userId,
  //   });

  //   if (!findOneUser)
  //     throw new HttpException(
  //       `User ${userId} not valid please change`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   return reply({
  //     res,
  //     results: findOneUser,
  //   });
  // }

  @Get(`/profile/show/:profileId`)
  @UseGuards(JwtAuthGuard)
  async getOneByProfileId(
    @Res() res,
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    const profile = await this.profilesService.findOneBy({
      profileId,
    });

    return reply({ res, results: profile });
  }

  @Put(`/update/profile/:profileId`)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Res() res,
    @Req() req,
    @Body() body: UpdateProfileDto,
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    const {
      fullName,
      countryId,
      currencyId,
      firstName,
      lastName,
      image,
      color,
      url,
      birthday,
      phone,
      firstAddress,
      secondAddress,
      description,
    } = body;

    await this.profilesService.updateOne(
      { profileId: profileId },
      {
        fullName,
        countryId,
        currencyId,
        firstName,
        lastName,
        image,
        color,
        url,
        birthday,
        phone,
        firstAddress,
        secondAddress,
        description,
      },
    );

    return reply({ res, results: 'Profile updated successfully' });
  }

  @Put(`/update/enable/:profileId`)
  @UseGuards(JwtAuthGuard)
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
      { profileId: profileId },
      {
        enableGallery: enableGallery && !findOneProfile?.enableGallery,
        enableShop: enableShop && !findOneProfile?.enableShop,
        enableCommission: enableCommission && !findOneProfile?.enableCommission,
      },
    );

    return reply({ res, results: 'profile updated successfully' });
  }

  @Put(`/change-email`)
  @UseGuards(JwtAuthGuard)
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
}
