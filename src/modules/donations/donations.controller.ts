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

import { DonationsService } from './donations.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { validationAmount } from '../../app/utils/decorators/date.decorator';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateOrUpdateDonationsDto,
  FilterDonationsDto,
} from './donations.dto';
import { CurrenciesService } from '../currencies/currencies.service';

@Controller('donations')
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  /** Get all Donations */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() filterDonationQuery: FilterDonationsDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const { userId, organizationId } = filterDonationQuery;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const donations = await this.donationsService.findAll({
      search,
      pagination,
      userId,
      organizationId,
    });

    return reply({ res, results: donations });
  }

  /** Get one Donations */
  @Get(`/show/:donationId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('donationId', ParseUUIDPipe) donationId: string,
  ) {
    const findOneDonation = await this.donationsService.findOneBy({
      donationId,
    });
    if (!findOneDonation)
      throw new HttpException(
        `Donation ${donationId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneDonation });
  }

  /** Create Donation */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateDonationsDto,
  ) {
    const { user } = req;

    const findOneCurrency = await this.currenciesService.findOneBy({
      currencyId: body?.currencyId,
    });

    validationAmount({ amount: body?.amount, currency: findOneCurrency });

    await this.donationsService.createOne({
      ...body,
      userId: user?.id,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: 'Donation created successfully' });
  }

  /** Update Donation  */
  @Put(`/:donationId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateDonationsDto,
    @Param('donationId', ParseUUIDPipe) donationId: string,
  ) {
    const findOneDonation = await this.donationsService.findOneBy({
      donationId,
    });
    if (!findOneDonation)
      throw new HttpException(
        `Donation ${donationId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCurrency = await this.currenciesService.findOneBy({
      currencyId: body?.currencyId,
    });

    validationAmount({ amount: body?.amount, currency: findOneCurrency });

    await this.donationsService.updateOne({ donationId }, { ...body });

    return reply({ res, results: 'Donation updated successfully' });
  }
}
