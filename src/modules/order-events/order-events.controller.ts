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
import { JwtAuthGuard } from '../users/middleware';

import { OrderEventsService } from './order-events.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateOrUpdateOderEventsDto,
  GetOderEventsDto,
} from './order-events.dto';

@Controller('order-events')
export class OrderEventsController {
  constructor(private readonly orderEventsService: OrderEventsService) {}

  /** Get all OrderEvents */
  @Get(`/`)
  async findAllOrderEvents(
    @Res() res,
    @Query() query: GetOderEventsDto,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { organizationId, userId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const orderEvents = await this.orderEventsService.findAll({
      search,
      organizationId,
      userId,
      pagination,
    });

    return reply({ res, results: orderEvents });
  }

  /** OrderEvent one OurEvents */
  @Put(`/:orderEventId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateOderEventsDto,
    @Param('orderEventId', ParseUUIDPipe) orderEventId: string,
  ) {
    const { status } = body;
    const { user } = req;

    const findOneOrderEvent = await this.orderEventsService.findOneBy({
      orderEventId,
      organizationId: user?.organizationId,
    });
    if (!findOneOrderEvent)
      throw new HttpException(
        `OrderEvent ${orderEventId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.orderEventsService.updateOne(
      { orderEventId },
      {
        status,
        userConfirmedId: user?.id,
      },
    );

    return reply({ res, results: 'order event updated successfully' });
  }

  /** Get one OrderEvent */
  @Get(`/view`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDOrderEvent(
    @Res() res,
    @Req() req,
    @Query('orderEventId', ParseUUIDPipe) orderEventId: string,
  ) {
    const { organizationId } = req.user;

    const findOneOrderEvent = await this.orderEventsService.findOneBy({
      orderEventId,
      organizationId: organizationId,
    });

    return reply({ res, results: findOneOrderEvent });
  }

  /** Delete OrderEvent */
  @Delete(`/:orderEventId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneOrderEvent(
    @Res() res,
    @Req() req,
    @Param('orderEventId', ParseUUIDPipe) orderEventId: string,
  ) {
    const findOneOrderEvent = await this.orderEventsService.findOneBy({
      orderEventId,
    });
    if (!findOneOrderEvent)
      throw new HttpException(
        `This OrderEvent ${orderEventId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.orderEventsService.updateOne(
      { orderEventId: findOneOrderEvent?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'OrderEvent deleted successfully' });
  }
}
