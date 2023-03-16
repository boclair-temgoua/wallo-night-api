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
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../../app/utils/reply';
import { useCatch } from '../../../app/utils/use-catch';
import * as amqplib from 'amqplib';

import { getIpRequest } from '../../../app/utils/commons/get-ip-request';
import { UsersService } from '../users.service';
import { CreateLoginUserDto, CreateRegisterUserDto } from '../users.dto';
import { ProfilesService } from '../../profiles/profiles.service';
import { OrganizationsService } from '../../organizations/organizations.service';
import { JwtPayloadType } from '../users.type';
import { CheckUserService } from '../middleware/check-user.service';
import Ipapi from '../../integrations/ipapi/ipapi';
import { ContributorsService } from '../../contributors/contributors.service';
import { ContributorRole } from '../../contributors/contributors.type';
import { JwtAuthGuard } from '../middleware';
import {
  RequestPaginationDto,
  addPagination,
  PaginationType,
} from '../../../app/utils/pagination';
import { SearchQueryDto } from '../../../app/utils/search-query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
    private readonly contributorsService: ContributorsService,
    private readonly organizationsService: OrganizationsService,
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
  @UseGuards(JwtAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const user = await this.usersService.findOneInfoBy({ option1: { userId } });

    return reply({ res, results: user });
  }

  @Get(`/profile/show/:profileId`)
  @UseGuards(JwtAuthGuard)
  async getOneByProfileId(
    @Res() res,
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    const profile = await this.profilesService.findOneBy({
      option1: { profileId },
    });

    return reply({ res, results: profile });
  }
}
