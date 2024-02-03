import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { FilterTransactionsDto } from './transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /** Get all Transactions */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: FilterTransactionsDto,
  ) {
    const { user } = req;
    const { campaignId, model, userSendId, organizationId, days } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const transactions = await this.transactionsService.findAll({
      search,
      days: Number(days) > 0 ? Number(days) : null,
      model: model?.toLocaleUpperCase(),
      campaignId,
      userSendId,
      pagination,
      organizationId: organizationId ?? user.organizationId,
    });

    return reply({ res, results: transactions });
  }

  /** Get Transaction statistic */
  @Get(`/statistics`)
  @UseGuards(JwtAuthGuard)
  async findGroupOrganization(
    @Res() res,
    @Req() req,
    @Query() query: FilterTransactionsDto,
  ) {
    const { user } = req;
    const { days, organizationId } = query;

    const transactions = await this.transactionsService.findGroupOrganization({
      organizationId: organizationId ?? user.organizationId,
      days: Number(days) > 0 ? Number(days) : null,
    });

    return reply({ res, results: transactions });
  }

  /** Get one Transaction */
  @Get(`/show/:transactionId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ) {
    const transaction = await this.transactionsService.findOneBy({
      transactionId,
    });

    return reply({ res, results: transaction });
  }
}
