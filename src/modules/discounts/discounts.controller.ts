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
import {
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
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

    const Discounts = await this.discountsService.findAll({
      search,
      pagination,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: Discounts });
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
    const { name, description, percent, expiredAt, startedAt } = body;

    await this.discountsService.createOne({
      name,
      description,
      percent,
      expiredAt,
      startedAt,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: 'Discount created successfully' });
  }

  /** Post one Discounts */
  @Put(`/:discountId`)
  @UseGuards(JwtAuthGuard)
  async updateOneCategory(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateDiscountsDto,
    @Param('discountId', ParseUUIDPipe) discountId: string,
  ) {
    const findOneDiscount = await this.discountsService.findOneBy({
      discountId,
    });
    if (!findOneDiscount)
      throw new HttpException(
        `Discount ${discountId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.discountsService.updateOne({ discountId }, { ...body });

    return reply({ res, results: 'Discount updated successfully' });
  }

  /** Get one Discounts */
  @Get(`/show/:discountId`)
  @UseGuards(JwtAuthGuard)
  async getOneCategory(
    @Res() res,
    @Param('discountId', ParseUUIDPipe) discountId: string,
  ) {
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
  async deleteOneCategory(
    @Res() res,
    @Req() req,
    @Param('discountId', ParseUUIDPipe) discountId: string,
  ) {
    const { user } = req;

    const category = await this.discountsService.updateOne(
      { discountId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Discount deleted successfully' });
  }
}
