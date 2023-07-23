import {
  Controller,
  Post,
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
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  FilterQueryType,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { ContributionsService } from './contributions.service';
import { JwtAuthGuard } from '../users/middleware';
import {
  CreateOneContributionDto,
  SearchContributionDto,
} from './contributions.dto';
import { config } from '../../app/config/index';
import { GiftsService } from '../gifts/gifts.service';
import { DonationsService } from '../donations/donations.service';
import { TransactionsService } from '../transactions/transactions.service';

@Controller('contributions')
export class ContributionsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly donationsService: DonationsService,
    private readonly transactionsService: TransactionsService,
    private readonly contributionsService: ContributionsService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: SearchContributionDto,
  ) {
    const { donationId, giftId, userId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const Contributions = await this.contributionsService.findAll({
      search,
      pagination,
      donationId,
      giftId,
      userId,
    });

    return reply({ res, results: Contributions });
  }

  @Post(`/donation`)
  async createOneByDonation(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneContributionDto,
  ) {
    const { amount, donationId, userSendId } = body;

    const findOneDonation = await this.donationsService.findOneBy({
      donationId,
    });
    if (!findOneDonation)
      throw new HttpException(
        `Donation ${donationId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const contribution = await this.contributionsService.createOne({
      amount: amount * 100,
      donationId,
      userId: userSendId,
      type: FilterQueryType.DONATION,
    });

    /** Create transaction */
    await this.transactionsService.createOne({
      contributionId: contribution?.id,
      description: `Contribution donation ${findOneDonation?.title}`,
      amount: contribution?.amount,
      userId: findOneDonation?.userId,
      userReceiveId: findOneDonation?.userId,
      userSendId: userSendId ?? null,
      donationId: findOneDonation?.id,
      organizationId: findOneDonation?.organizationId,
    });

    return reply({ res, results: 'contribution save successfully' });
  }

  @Post(`/gift`)
  @UseGuards(JwtAuthGuard)
  async createOneByGift(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneContributionDto,
  ) {
    const { user } = req;
    const { amount, giftId, userSendId } = body;

    const findOneGift = await this.giftsService.findOneBy({
      giftId,
    });
    if (!findOneGift)
      throw new HttpException(
        `Gift ${giftId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const contribution = await this.contributionsService.createOne({
      amount: amount * 100,
      giftId,
      userId: user?.id,
      type: FilterQueryType.GIFT,
    });

    await this.transactionsService.createOne({
      contributionId: contribution?.id,
      description: `Contribution gift ${findOneGift?.title}`,
      amount: contribution?.amount,
      userId: findOneGift?.userId,
      userReceiveId: findOneGift?.userId,
      userSendId: userSendId ?? null,
      giftId: findOneGift?.id,
      organizationId: findOneGift?.organizationId,
    });

    return reply({ res, results: 'contribution save successfully' });
  }
}
