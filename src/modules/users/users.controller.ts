import {
  Body,
  Controller,
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
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import {
  PaginationType,
  RequestPaginationDto,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { ContributorsService } from '../contributors/contributors.service';
import { ProfilesService } from '../profiles/profiles.service';
import { UserAuthGuard } from './middleware';
import { UpdateOneEmailUserDto, UpdateProfileDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
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
  @UseGuards(UserAuthGuard)
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

  @Get(`/me`)
  @UseGuards(UserAuthGuard)
  async getMe(@Res() res, @Req() req) {
    const { user } = req;

    const findOneUser = await this.usersService.findOneInfoBy({
      userId: user?.id,
    });
    if (!findOneUser) throw new UnauthorizedException('Invalid user');

    return reply({ res, results: findOneUser });
  }

  @Put(`/update/profile/:profileId`)
  @UseGuards(UserAuthGuard)
  async updateProfile(
    @Res() res,
    @Body() body: UpdateProfileDto,
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    const {
      fullName,
      firstName,
      lastName,
      image,
      color,
      phone,
      firstAddress,
      secondAddress,
    } = body;

    await this.profilesService.updateOne(
      { profileId: profileId },
      {
        fullName,
        firstName,
        lastName,
        image,
        color,
        phone,
        firstAddress,
        secondAddress,
      },
    );

    return reply({ res, results: 'Profile updated successfully' });
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
}
