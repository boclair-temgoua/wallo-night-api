import {
  Controller,
  Param,
  Res,
  Query,
  Get,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../../app/utils/reply';

import { UsersService } from '../users.service';
import { ProfilesService } from '../../profiles/profiles.service';
import { JwtAuthGuard } from '../middleware';
import {
  RequestPaginationDto,
  addPagination,
  PaginationType,
} from '../../../app/utils/pagination';
import { SearchQueryDto } from '../../../app/utils/search-query';

@Controller('users')
export class UsersInternalController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
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
