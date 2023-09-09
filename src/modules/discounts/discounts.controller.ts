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

import { DiscountsService } from './discounts.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateDiscountsDto } from './discounts.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get(`/user`)
  @UseGuards(JwtAuthGuard)
  async findAllByUserId(@Res() res, @Req() req) {
    const { user } = req;

    const discounts = await this.discountsService.findAllNotPaginate({
      userId: user?.id,
    });

    return reply({ res, results: discounts });
  }

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
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
      userId: user?.id,
    });

    return reply({ res, results: discounts });
  }

  /** Post one Discounts */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateDiscountsDto,
  ) {
    const { user } = req;

    await this.discountsService.createOne({ ...body, userId: user?.id });

    return reply({ res, results: 'discount created successfully' });
  }

  /** Post one Discounts */
  @Put(`/:discountId`)
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('discountId', ParseUUIDPipe) discountId: string,
  ) {
    const { user } = req;

    await this.discountsService.updateOne(
      { discountId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'discount deleted successfully' });
  }
}
