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
import { UserAuthGuard } from '../users/middleware';

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
  @UseGuards(UserAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: FilterTransactionsDto,
  ) {
    const { user } = req;
    const { userId, campaignId, model, userSendId, userReceiveId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const transactions = await this.transactionsService.findAll({
      search,
      userId,
      model: model?.toLocaleUpperCase(),
      userSendId,
      organizationId: user?.organizationId,
      pagination,
    });

    return reply({ res, results: transactions });
  }

  /** Get one Transaction */
  @Get(`/show/:transactionId`)
  @UseGuards(UserAuthGuard)
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
