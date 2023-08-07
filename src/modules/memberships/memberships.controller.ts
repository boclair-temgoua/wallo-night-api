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
import { MembershipsService } from './memberships.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateMembershipsDto } from './memberships.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { CurrenciesService } from '../currencies/currencies.service';

@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllByOrganizationId(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const memberships = await this.membershipsService.findAll({
      search,
      pagination,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: memberships });
  }

  /** Post one Memberships */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateMembershipsDto,
  ) {
    const { user } = req;
    const {
      title,
      pricePerMonthly,
      pricePerYearly,
      messageWelcome,
      currency,
      description,
    } = body;

    const findOneCurrency = await this.currenciesService.findOneBy({
      code: currency,
    });

    // validationAmount({ messageWelcome,pricePerMonthly, currency: findOneCurrency });

    await this.membershipsService.createOne({
      title,
      currencyId: findOneCurrency?.id,
      description,
      userId: user?.id,
      pricePerYearly,
      pricePerMonthly,
      messageWelcome,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: 'membership created successfully' });
  }

  /** Post one Memberships */
  @Put(`/:membershipId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateMembershipsDto,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const { title, pricePerMonthly, pricePerYearly, currency, description } =
      body;
    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `Membership ${membershipId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCurrency = await this.currenciesService.findOneBy({
      code: currency,
    });

    // validationAmount({ amount: body?.amount, currency: findOneCurrency });

    await this.membershipsService.updateOne(
      { membershipId },
      {
        title,
        pricePerMonthly,
        currencyId: findOneCurrency?.id,
        pricePerYearly,
        description,
      },
    );

    return reply({ res, results: 'membership updated successfully' });
  }

  /** Get one Memberships */
  @Get(`/show/:membershipId`)
  async getOne(
    @Res() res,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `Membership ${membershipId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneMembership });
  }

  /** Active one Memberships */
  @Get(`/status`)
  @UseGuards(JwtAuthGuard)
  async changeStatusOne(
    @Res() res,
    @Req() req,
    @Query('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `membership ${membershipId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    // await this.membershipsService.updateOne(
    //   { membershipId },
    //   { isActive: !findOneMembership?.isActive },
    // );

    return reply({ res, results: 'membership update successfully' });
  }

  /** Delete one Memberships */
  @Delete(`/:membershipId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    await this.membershipsService.updateOne(
      { membershipId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'membership deleted successfully' });
  }
}
