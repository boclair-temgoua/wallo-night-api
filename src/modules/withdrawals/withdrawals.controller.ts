import {
  Controller,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Res,
  Get,
  Query,
  Post,
  Req,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';

import { WithdrawalsService } from './withdrawals.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { CreateWithdrawalsDto } from './withdrawals.dto';
import { WalletsService } from '../wallets/wallets.service';

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(
    private readonly withdrawalsService: WithdrawalsService,
    private readonly walletsService: WalletsService,
  ) {}

  /** Get all Withdrawals */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const withdrawals = await this.withdrawalsService.findAll({
      search,
      pagination,
      userId: user?.id,
    });

    return reply({ res, results: withdrawals });
  }

  /** Post one Withdrawal */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(@Res() res, @Req() req, @Body() body: CreateWithdrawalsDto) {
    const { user } = req;
    const { title, amount, description, withdrawalUserId } = body;

    const findOneWallet = await this.walletsService.findOneBy({
      organizationId: user?.organizationId,
    });
    if (!findOneWallet)
      throw new HttpException(
        `Wallet ${user?.id} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    // validationAmount({ amount, currency: findOneCurrency });
    await this.withdrawalsService.createOne({
      amount,
      description,
      userId: user?.id,
      withdrawalUserId,
    });

    return reply({ res, results: 'withdrawals created successfully' });
  }

  /** Get one Withdrawal */
  @Get(`/show/:withdrawalId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('withdrawalId', ParseUUIDPipe) withdrawalId: string,
  ) {
    const withdrawal = await this.withdrawalsService.findOneBy({
      withdrawalId,
    });

    return reply({ res, results: withdrawal });
  }
}
