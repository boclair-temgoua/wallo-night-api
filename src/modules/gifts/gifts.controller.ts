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
  ParseBoolPipe,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { GiftsService } from './gifts.service';
import {
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateGiftsDto } from './gifts.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { CurrenciesService } from '../currencies/currencies.service';
import { config } from '../../app/config';
import { validationAmount } from '../../app/utils/decorators/date.decorator';

@Controller('gifts')
export class GiftsController {
  constructor(
    private readonly giftsService: GiftsService,
    private readonly currenciesService: CurrenciesService,
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

    const gifts = await this.giftsService.findAll({
      search,
      pagination,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: gifts });
  }

  /** Post one Gifts */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateGiftsDto,
  ) {
    const { user } = req;
    const { title, amount, currencyId, expiredAt, description } = body;

    const findOneCurrency = await this.currenciesService.findOneBy({
      currencyId: currencyId,
    });

    validationAmount({ amount, currency: findOneCurrency });

    await this.giftsService.createOne({
      title,
      amount,
      currencyId,
      expiredAt,
      description,
      userId: user?.id,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: 'Gift created successfully' });
  }

  /** Post one Gifts */
  @Put(`/:giftId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateGiftsDto,
    @Param('giftId', ParseUUIDPipe) giftId: string,
  ) {
    const findOneGift = await this.giftsService.findOneBy({
      giftId,
    });
    if (!findOneGift)
      throw new HttpException(
        `Gift ${giftId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCurrency = await this.currenciesService.findOneBy({
      currencyId: body?.currencyId,
    });

    validationAmount({ amount: body?.amount, currency: findOneCurrency });

    await this.giftsService.updateOne({ giftId }, { ...body });

    return reply({ res, results: 'Gift updated successfully' });
  }

  /** Get one Gifts */
  @Get(`/show/:giftId`)
  async getOne(@Res() res, @Param('giftId', ParseUUIDPipe) giftId: string) {
    const findOneGift = await this.giftsService.findOneBy({
      giftId,
    });
    if (!findOneGift)
      throw new HttpException(
        `Gift ${giftId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneGift });
  }

  /** Active one Gifts */
  @Get(`/status`)
  @UseGuards(JwtAuthGuard)
  async changeStatusOne(
    @Res() res,
    @Req() req,
    @Query('giftId', ParseUUIDPipe) giftId: string,
  ) {
    const findOneGift = await this.giftsService.findOneBy({
      giftId,
    });
    if (!findOneGift)
      throw new HttpException(
        `Gift ${giftId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.giftsService.updateOne(
      { giftId },
      { isActive: !findOneGift?.isActive },
    );

    return reply({ res, results: 'Gift update successfully' });
  }

  /** Delete one Gifts */
  @Delete(`/:giftId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('giftId', ParseUUIDPipe) giftId: string,
  ) {
    await this.giftsService.updateOne({ giftId }, { deletedAt: new Date() });

    return reply({ res, results: 'Gift deleted successfully' });
  }
}
