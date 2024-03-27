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

import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { UserAuthGuard } from '../users/middleware';
import { CreateOrUpdateDiscountsDto } from './discounts.dto';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get(`/user`)
  @UseGuards(UserAuthGuard)
  async findAllByUserId(@Res() res, @Req() req) {
    const { user } = req;

    const discounts = await this.discountsService.findAllNotPaginate({
      organizationId: user?.organizationId,
    });

    return reply({ res, results: discounts });
  }

  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAllByUserNotPaginate(
    @Res() res,
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
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
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
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
