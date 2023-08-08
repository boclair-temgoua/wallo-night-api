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
import { UpdateOneEmailUserDto, UpdateProfileDto } from './users.dto';
import { ContributorsService } from '../contributors/contributors.service';

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
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const users = await this.usersService.findAll({ search, pagination });

    return reply({ res, results: users });
  }

  /** Get one user */
  @Get(`/show/:userId`)
  async getOneByIdUser(
    @Res() res,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const user = await this.usersService.findOneInfoBy({ userId });

    const getOneContributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      type: FilterQueryType.ORGANIZATION,
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
      image,
      color,
      url,
      birthday,
      phone,
      firstAddress,
      secondAddress,
    } = body;

    await this.profilesService.updateOne(
      { profileId: profileId },
      {
        fullName,
        countryId,
        currencyId,
        image,
        color,
        url,
        birthday,
        phone,
        firstAddress,
        secondAddress,
      },
    );

    return reply({ res, results: 'Profile updated successfully' });
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
