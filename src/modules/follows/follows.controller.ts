import {
  Controller,
  Post,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Put,
  Res,
  Req,
  Get,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';

import { FollowsService } from './follows.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  /** Get all Follows */
  @Get(`/followers`)
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
