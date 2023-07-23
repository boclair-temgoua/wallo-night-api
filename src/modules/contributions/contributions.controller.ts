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
  ParseBoolPipe,
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
import * as amqplib from 'amqplib';
import { ContributionsService } from './contributions.service';
import { JwtAuthGuard } from '../users/middleware';
import {
  CreateOneContributionDto,
  SearchContributionDto,
} from './contributions.dto';
import { config } from '../../app/config/index';
import { GiftsService } from '../gifts/gifts.service';
import { DonationsService } from '../donations/donations.service';

@Controller('contributions')
export class ContributionsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly donationsService: DonationsService,
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
    const { donationId, giftId, userId, organizationId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const Contributions = await this.contributionsService.findAll({
      search,
      pagination,
      donationId,
      giftId,
      userId,
      organizationId,
    });

    return reply({ res, results: Contributions });
  }

  @Post(`/donation`)
  @UseGuards(JwtAuthGuard)
  async createOneByDonation(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneContributionDto,
  ) {
    const { user } = req;
    const { amount, donationId } = body;

    const findOneDonation = await this.donationsService.findOneBy({
      donationId,
    });
    if (!findOneDonation)
      throw new HttpException(
        `Donation ${donationId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.contributionsService.createOne({
      amount: amount * 100,
      donationId,
      userId: user?.id,
      type: FilterQueryType.DONATION,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: 'contribution save successfully' });
  }
}
