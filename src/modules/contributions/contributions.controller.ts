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
  CreateOneContributionDonationDto,
  CreateOneContributionDto,
  CreateOneContributionGiftDto,
  SearchContributionDto,
} from './contributions.dto';
import { config } from '../../app/config/index';
import { GiftsService } from '../gifts/gifts.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { TransactionsService } from '../transactions/transactions.service';
import { validationAmount } from '../../app/utils/decorators/date.decorator';
import { CurrenciesService } from '../currencies/currencies.service';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { BullingService } from '../bulling/bulling.service';

@Controller('contributions')
export class ContributionsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly usersService: UsersService,
    private readonly bullingService: BullingService,
    private readonly walletsService: WalletsService,
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

  /** Create campaign */
  @Post(`/campaign`)
  async createOneByCampaign(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneContributionDto,
  ) {
    const {
      amount,
      campaignId,
      currency,
      userSendId,
      meanOfPayment,
      infoPaymentMethod,
    } = body;

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

    /** Create payment stripe */
    meanOfPayment === 'CARD' && infoPaymentMethod?.id
      ? await this.bullingService.stripeMethod({
          amount: amountConvert * 100,
          currency: 'EUR',
          fullName: 'Inconnu',
          email: 'email@inconnu.com',
          description: `Contribution campaign ${findOneCampaign?.title}`,
          infoPaymentMethod: infoPaymentMethod,
        })
      : null;

    /** create contribution */
    const contribution = await this.contributionsService.createOne({
      amount: amount * 100,
      campaignId,
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
      userSendId: userSendId,
      campaignId: findOneCampaign?.id,
    });

    /** Update wallet */
    await this.walletsService.incrementOne({
      userId: findOneCampaign?.userId,
      amount: contribution?.amountConvert,
    });

    return reply({ res, results: 'contribution save successfully' });
  }

  /** Create gift */
  @Post(`/gift`)
  async createOneByGift(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneContributionGiftDto,
  ) {
    const { giftId, userSendId, meanOfPayment, infoPaymentMethod } = body;

    const findOneGift = await this.giftsService.findOneBy({
      giftId,
    });
    if (!findOneGift)
      throw new HttpException(
        `Gift ${giftId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const { amountConvert } = validationAmount({
      amount: findOneGift?.amount / 100,
      currency: findOneGift?.currency,
    });

    /** Create payment stripe */
    meanOfPayment === 'CARD' && infoPaymentMethod?.id
      ? await this.bullingService.stripeMethod({
          amount: amountConvert * 100,
          currency: 'EUR',
          fullName: 'Inconnu',
          email: 'email@inconnu.com',
          description: `Contribution gift ${findOneGift?.title}`,
          infoPaymentMethod: infoPaymentMethod,
        })
      : null;

    /** create contribution */
    const contribution = await this.contributionsService.createOne({
      amount: Number(findOneGift?.amount),
      giftId: findOneGift?.id,
      currencyId: findOneGift?.currencyId,
      amountConvert: amountConvert * 100,
      type: FilterQueryType.GIFT,
    });

    /** create transaction */
    await this.transactionsService.createOne({
      contributionId: contribution?.id,
      description: `Contribution gift ${findOneGift?.title}`,
      amount: contribution?.amount,
      userId: findOneGift?.userId,
      userReceiveId: findOneGift?.userId,
      userSendId: userSendId,
      giftId: findOneGift?.id,
      type: meanOfPayment,
    });

    /** Update wallet */
    await this.walletsService.incrementOne({
      userId: findOneGift?.userId,
      amount: contribution?.amountConvert,
    });

    return reply({ res, results: 'contribution save successfully' });
  }

  /** Create donation */
  @Post(`/donation`)
  async createOneByDonation(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneContributionDonationDto,
  ) {
    const {
      userId,
      amount,
      currency,
      userSendId,
      meanOfPayment,
      infoPaymentMethod,
    } = body;

    const findOneUser = await this.usersService.findOneBy({
      userId,
    });
    if (!findOneUser)
      throw new HttpException(
        `User ${userId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCurrency = await this.currenciesService.findOneBy({
      code: currency,
    });
    const { amountConvert } = validationAmount({
      amount: amount,
      currency: findOneCurrency,
    });

    /** Create payment stripe */
    meanOfPayment === 'CARD' && infoPaymentMethod?.id
      ? await this.bullingService.stripeMethod({
          amount: amountConvert * 100,
          currency: 'EUR',
          fullName: 'Inconnu',
          email: 'email@inconnu.com',
          description: `Donation ${amount} ${currency}`,
          infoPaymentMethod: infoPaymentMethod,
        })
      : null;

    /** Create contribution */
    const contribution = await this.contributionsService.createOne({
      amount: amount * 100,
      userId: findOneUser?.id,
      amountConvert: amountConvert * 100,
      currencyId: findOneCurrency?.id,
      type: FilterQueryType.DONATION,
    });

    /** Create transaction */
    await this.transactionsService.createOne({
      contributionId: contribution?.id,
      description: `Donation ${amount} ${currency}`,
      amount: contribution?.amount,
      userId: userId,
      userReceiveId: findOneUser?.id,
      userSendId: userSendId ?? null,
      type: meanOfPayment,
    });

    /** Update wallet */
    await this.walletsService.incrementOne({
      userId: userId,
      amount: contribution?.amountConvert,
    });

    return reply({ res, results: 'contribution save successfully' });
  }
}
