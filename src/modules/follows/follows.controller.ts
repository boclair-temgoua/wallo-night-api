import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { CookieAuthGuard } from '../users/middleware';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { FollowsService } from './follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  /** Get all Follows */
  @Get(`/followers`)
  @UseGuards(CookieAuthGuard)
  async findFollowers(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const follows = await this.followsService.findAll({
      search,
      pagination,
      followerId: user?.id,
    });

    return reply({ res, results: follows });
  }

  /** Get all Follows */
  @Get(`/followings`)
  @UseGuards(CookieAuthGuard)
  async findFollowings(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const follows = await this.followsService.findAll({
      search,
      pagination,
      userId: user?.id,
    });

    return reply({ res, results: follows });
  }

  /** Create Follow */
  @Post(`/create/:followerId`)
  @UseGuards(CookieAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Param('followerId', ParseUUIDPipe) followerId: string,
  ) {
    const { user } = req;

    const findOneFollow = await this.followsService.findOneBy({
      followerId,
      userId: user?.id,
    });

    if (!findOneFollow) {
      await this.followsService.createOne({
        userId: user?.id,
        followerId,
      });
    }

    return reply({ res, results: 'User follow successfully' });
  }

  /** Delete Follow */
  @Post(`/delete/:followerId`)
  @UseGuards(CookieAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('followerId', ParseUUIDPipe) followerId: string,
  ) {
    const { user } = req;

    const findOneFollow = await this.followsService.findOneBy({
      followerId,
      userId: user?.id,
    });
    if (!findOneFollow)
      throw new HttpException(
        `This follow ${followerId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.followsService.updateOne(
      { followId: findOneFollow?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'User follow deleted successfully' });
  }
}
