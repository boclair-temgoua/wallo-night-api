import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
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
import {
  CreateOrUpdateOderEventsDto,
  GetOderEventsDto,
} from './order-events.dto';
import { OrderEventsService } from './order-events.service';

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
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
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
