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
  Delete,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';

import { WithdrawalUsersService } from './withdrawal-users.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { CreateWithdrawalUsersDto } from './withdrawal-users.dto';
import { WalletsService } from '../wallets/wallets.service';

@Controller('withdrawal-users')
export class WithdrawalUsersController {
  constructor(
    private readonly withdrawalUsersService: WithdrawalUsersService,
    private readonly walletsService: WalletsService,
  ) {}

  /** Get all WithdrawalUsers */
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

    const withdrawalUsers = await this.withdrawalUsersService.findAll({
      search,
      pagination,
      userId: user?.id,
    });

    return reply({ res, results: withdrawalUsers });
  }

  /** Post one Gifts */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateWithdrawalUsersDto,
  ) {
    const { user } = req;

    const findOneWallet = await this.walletsService.findOneBy({
      organizationId: user?.organizationId,
    });
    if (!findOneWallet)
      throw new HttpException(
        `Wallet ${user?.id} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    // validationAmount({ amount, currency: findOneCurrency });
    await this.withdrawalUsersService.createOne({
      ...body,
      userId: user?.id,
    });

    return reply({ res, results: 'withdrawalUsers created successfully' });
  }

  /** Get one WithdrawalUser */
  @Get(`/show/:withdrawalUserId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('withdrawalUserId', ParseUUIDPipe) withdrawalUserId: string,
  ) {
    const withdrawalUser = await this.withdrawalUsersService.findOneBy({
      withdrawalUserId,
    });

    return reply({ res, results: withdrawalUser });
  }

  /** Delete WithdrawalUser */
  @Delete(`/:withdrawalUserId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneProject(
    @Res() res,
    @Req() req,
    @Param('withdrawalUserId', ParseUUIDPipe) withdrawalUserId: string,
  ) {
    const findOneWithdrawalUser = await this.withdrawalUsersService.findOneBy({
      withdrawalUserId,
    });
    if (!findOneWithdrawalUser)
      throw new HttpException(
        `This withdrawal user ${withdrawalUserId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.withdrawalUsersService.updateOne(
      { withdrawalUserId: findOneWithdrawalUser?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'withdrawal user deleted successfully' });
  }
}
