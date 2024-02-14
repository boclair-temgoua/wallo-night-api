import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CookieAuthGuard } from '../users/middleware';
import { CreateOrUpdateDiscountsDto } from './discounts.dto';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get(`/user`)
  @UseGuards(CookieAuthGuard)
  async findAllByUserId(@Res() res, @Req() req) {
    const { user } = req;

    const discounts = await this.discountsService.findAllNotPaginate({
      organizationId: user?.organizationId,
    });

    return reply({ res, results: discounts });
  }

  @Get(`/`)
  @UseGuards(CookieAuthGuard)
  async findAllByUserNotPaginate(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const discounts = await this.discountsService.findAll({
      search,
      pagination,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: discounts });
  }

  /** Post one Discounts */
  @Post(`/`)
  @UseGuards(CookieAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateDiscountsDto,
  ) {
    const { user } = req;

    await this.discountsService.createOne({
      ...body,
      userId: user?.id,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: 'discount created successfully' });
  }

  /** Post one Discounts */
  @Put(`/:discountId`)
  @UseGuards(CookieAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateDiscountsDto,
    @Param('discountId', ParseUUIDPipe) discountId: string,
  ) {
    const { code, description, enableExpiredAt, percent, expiredAt } = body;
    const findOneDiscount = await this.discountsService.findOneBy({
      discountId,
    });
    if (!findOneDiscount)
      throw new HttpException(
        `Discount ${discountId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.discountsService.updateOne(
      { discountId },
      {
        code,
        description,
        enableExpiredAt,
        percent,
        expiredAt: enableExpiredAt ? expiredAt : null,
      },
    );

    return reply({ res, results: 'discount updated successfully' });
  }

  /** Get one Discounts */
  @Get(`/show/:discountId`)
  @UseGuards(CookieAuthGuard)
  async getOne(@Res() res, @Param('discountId') discountId: string) {
    const findOneDiscount = await this.discountsService.findOneBy({
      discountId,
    });
    if (!findOneDiscount)
      throw new HttpException(
        `Discount ${discountId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneDiscount });
  }

  /** Delete one Discounts */
  @Delete(`/:discountId`)
  @UseGuards(CookieAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('discountId', ParseUUIDPipe) discountId: string,
  ) {
    const { user } = req;
    const findOneDiscount = await this.discountsService.findOneBy({
      discountId,
      organizationId: user?.organizationId,
    });
    if (!findOneDiscount)
      throw new HttpException(
        `Discount ${discountId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    await this.discountsService.updateOne(
      { discountId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'discount deleted successfully' });
  }
}
