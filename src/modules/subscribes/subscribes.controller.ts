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

import { SubscribesService } from './subscribes.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { FollowsService } from '../follows/follows.service';
import { MembershipsService } from '../memberships/memberships.service';
import { TransactionsService } from '../transactions/transactions.service';
import {
  addDaysToTimeNowUtcDate,
  addMonthsFormateDDMMYYDate,
  addMonthsToTimeNowUtcDate,
  addYearsFormateDDMMYYDate,
  formateNowDateUnixInteger,
} from '../../app/utils/commons/formate-date';

@Controller('subscribes')
export class SubscribesController {
  constructor(
    private readonly followsService: FollowsService,
    private readonly subscribesService: SubscribesService,
    private readonly membershipsService: MembershipsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  /** Get all Follows */
  @Get(`/subscribers`)
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

    const subscribers = await this.subscribesService.findAll({
      search,
      pagination,
      subscriberId: user?.id,
    });

    return reply({ res, results: subscribers });
  }

  /** Get all Follows */
  // @Get(`/followings`)
  // @UseGuards(JwtAuthGuard)
  // async findFollowings(
  //   @Res() res,
  //   @Req() req,
  //   @Query() requestPaginationDto: RequestPaginationDto,
  //   @Query() searchQuery: SearchQueryDto,
  // ) {
  //   const { user } = req;
  //   const { search } = searchQuery;

  //   const { take, page, sort } = requestPaginationDto;
  //   const pagination: PaginationType = addPagination({ page, take, sort });

  //   const follows = await this.followsService.findAll({
  //     search,
  //     pagination,
  //     userId: user?.id,
  //   });

  //   return reply({ res, results: follows });
  // }

  /** Create Subscribe */
  @Post(`/create/:membershipId`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const { user } = req;

    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `This membership ${membershipId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneFollow = await this.followsService.findOneBy({
      followerId: findOneMembership?.userId,
      userId: user?.id,
    });
    const findOneSubscribe = await this.subscribesService.findOneBy({
      subscriberId: findOneMembership?.userId,
      userId: user?.id,
    });

    if (!findOneFollow) {
      await this.followsService.createOne({
        userId: user?.id,
        followerId: findOneMembership?.userId,
      });
    }

    if (findOneSubscribe) {
      const dateExpired = formateNowDateUnixInteger(
        findOneSubscribe?.expiredAt,
      );
      const dateNow = formateNowDateUnixInteger(new Date());

      await this.subscribesService.updateOne(
        { subscribeId: findOneSubscribe?.id },
        {
          userId: user?.id,
          subscriberId: findOneMembership?.userId,
          membershipId: findOneSubscribe?.id,
          expiredAt:
            dateExpired > dateNow
              ? addMonthsFormateDDMMYYDate({
                  date: findOneSubscribe?.expiredAt,
                  monthNumber: 1,
                })
              : addMonthsFormateDDMMYYDate({
                  date: new Date(),
                  monthNumber: 1,
                }),
        },
      );

      await this.transactionsService.createOne({
        userId: user?.id,
        userSendId: user?.id,
        userReceiveId: findOneMembership?.userId,
        subscribeId: findOneSubscribe?.id,
        amount: Number(findOneMembership?.pricePerMonthly),
        description: 'subscribe monthly'
      });
    } else {
      const subscribe = await this.subscribesService.createOne({
        userId: user?.id,
        subscriberId: findOneMembership?.userId,
        membershipId,
        expiredAt: addMonthsFormateDDMMYYDate({
          date: new Date(),
          monthNumber: 1,
        }),
      });

      await this.transactionsService.createOne({
        userId: user?.id,
        userSendId: user?.id,
        userReceiveId: findOneMembership?.userId,
        subscribeId: subscribe?.id,
        amount: Number(findOneMembership?.pricePerMonthly),
        description: 'subscribe monthly'
      });
    }

    return reply({ res, results: 'User Subscribe successfully' });
  }
}
