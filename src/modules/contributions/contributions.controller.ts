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
import { CampaignsService } from '../campaigns/campaigns.service';
import { TransactionsService } from '../transactions/transactions.service';
import { validationAmount } from '../../app/utils/decorators/date.decorator';
import { CurrenciesService } from '../currencies/currencies.service';

@Controller('contributions')
export class ContributionsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly campaignsService: CampaignsService,
    private readonly currenciesService: CurrenciesService,
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
    const { campaignId, giftId, userId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const Contributions = await this.contributionsService.findAll({
      search,
      pagination,
      campaignId,
      giftId,
      userId,
    });

    return reply({ res, results: Contributions });
  }

  @Post(`/campaign`)
  async createOneByCampaign(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneContributionDto,
  ) {
    const { amount, campaignId, currency, userSendId } = body;

    const findOneCampaign = await this.campaignsService.findOneBy({
      campaignId,
    });
    if (!findOneCampaign)
      throw new HttpException(
        `Campaign ${campaignId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCurrency = await this.currenciesService.findOneBy({
      code: currency,
    });
    const { amountConvert } = validationAmount({
      amount: amount,
      currency: findOneCurrency,
    });

    const contribution = await this.contributionsService.createOne({
      amount: amount * 100,
      campaignId,
      userId: userSendId,
      amountConvert: amountConvert * 100,
      currencyId: findOneCurrency?.id,
      type: FilterQueryType.CAMPAIGN,
    });

    /** Create transaction */
    await this.transactionsService.createOne({
      contributionId: contribution?.id,
      description: `Contribution campaign ${findOneCampaign?.title}`,
      amount: contribution?.amount,
      userId: findOneCampaign?.userId,
      userReceiveId: findOneCampaign?.userId,
      userSendId: userSendId ?? null,
      campaignId: findOneCampaign?.id,
      organizationId: findOneCampaign?.organizationId,
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
    const { amount, giftId, currency, userSendId } = body;

    const findOneGift = await this.giftsService.findOneBy({
      giftId,
    });
    if (!findOneGift)
      throw new HttpException(
        `Gift ${giftId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCurrency = await this.currenciesService.findOneBy({
      code: currency,
    });
    validationAmount({ amount: amount, currency: findOneCurrency });

    const contribution = await this.contributionsService.createOne({
      amount: amount * 100,
      giftId,
      userId: user?.id,
      currencyId: findOneCurrency?.id,
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
