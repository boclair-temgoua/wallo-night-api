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

import { CampaignsService } from './campaigns.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { validationAmount } from '../../app/utils/decorators/date.decorator';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateOrUpdateCampaignsDto,
  FilterCampaignsDto,
} from './campaigns.dto';
import { CurrenciesService } from '../currencies/currencies.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  /** Get all Campaigns */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() filterCampaignQuery: FilterCampaignsDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const { userId, organizationId } = filterCampaignQuery;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const Campaigns = await this.campaignsService.findAll({
      search,
      pagination,
      userId,
      organizationId,
    });

    return reply({ res, results: Campaigns });
  }

  /** Get one Campaigns */
  @Get(`/show/:campaignId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
  ) {
    const findOneCampaign = await this.campaignsService.findOneBy({
      campaignId,
    });
    if (!findOneCampaign)
      throw new HttpException(
        `Campaign ${campaignId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneCampaign });
  }

  /** Create Campaign */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCampaignsDto,
  ) {
    const { user } = req;

    const findOneCurrency = await this.currenciesService.findOneBy({
      currencyId: body?.currencyId,
    });

    validationAmount({ amount: body?.amount, currency: findOneCurrency });

    await this.campaignsService.createOne({
      ...body,
      userId: user?.id,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: 'Campaign created successfully' });
  }

  /** Update Campaign  */
  @Put(`/:campaignId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCampaignsDto,
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
  ) {
    const findOneCampaign = await this.campaignsService.findOneBy({
      campaignId,
    });
    if (!findOneCampaign)
      throw new HttpException(
        `Campaign ${campaignId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCurrency = await this.currenciesService.findOneBy({
      currencyId: body?.currencyId,
    });

    validationAmount({ amount: body?.amount, currency: findOneCurrency });

    await this.campaignsService.updateOne({ campaignId }, { ...body });

    return reply({ res, results: 'Campaign updated successfully' });
  }
}
