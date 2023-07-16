import {
  Controller,
  Post,
  NotFoundException,
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
import { JwtAuthGuard } from '../users/middleware';

import { InvestmentsService } from './investments.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateOrUpdateInvestmentsDto,
  FilterInvestmentsDto,
} from './investments.dto';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  /** Get all Investments */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() filterInvestmentQuery: FilterInvestmentsDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const { userId, organizationId, donationId } = filterInvestmentQuery;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const investments = await this.investmentsService.findAll({
      search,
      pagination,
      userId,
      organizationId,
      donationId,
    });

    return reply({ res, results: investments });
  }

  /** Get one Investments */
  @Get(`/show/:investmentId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('investmentId', ParseUUIDPipe) investmentId: string,
  ) {
    const findOneInvestment = await this.investmentsService.findOneBy({
      investmentId,
    });
    if (!findOneInvestment)
      throw new HttpException(
        `Investment ${investmentId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneInvestment });
  }

  /** Create Investment */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateInvestmentsDto,
  ) {
    const { user } = req;

    await this.investmentsService.createOne({
      ...body,
      userId: user?.id,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: 'Investment created successfully' });
  }

  /** Update Investment  */
  @Put(`/:investmentId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateInvestmentsDto,
    @Param('investmentId', ParseUUIDPipe) investmentId: string,
  ) {
    const findOneInvestment = await this.investmentsService.findOneBy({
      investmentId,
    });
    if (!findOneInvestment)
      throw new HttpException(
        `Investment ${investmentId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.investmentsService.updateOne({ investmentId }, { ...body });

    return reply({ res, results: 'Investment updated successfully' });
  }
}
