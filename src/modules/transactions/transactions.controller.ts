import {
  Controller,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Res,
  Get,
  Query,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';

import { TransactionsService } from './transactions.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { FilterTransactionsDto } from './transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /** Get all Transactions */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: FilterTransactionsDto,
  ) {
    const { userId, campaignId, model, userSendId, userReceiveId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const transactions = await this.transactionsService.findAll({
      search,
      userId,
      model: model?.toLocaleUpperCase(),
      campaignId,
      userSendId,
      userReceiveId,
      pagination,
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
    const Transaction = await this.transactionsService.findOneBy({
      transactionId,
    });

    return reply({ res, results: Transaction });
  }
}
