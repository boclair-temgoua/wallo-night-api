import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  PaginationType,
  RequestPaginationDto,
  addPagination,
} from '../../app/utils/pagination';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from '../../app/utils/search-query';
import { CartsService } from '../cats/cats.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { JwtAuthGuard } from '../users/middleware';
import { GetOrderItemDto } from './orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartsService: CartsService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const orders = await this.ordersService.findAll({
      userId: user?.id,
      search,
      pagination,
    });

    return reply({ res, results: orders });
  }

  /** Get OrderItems */
  @Get(`/order-items`)
  @UseGuards(JwtAuthGuard)
  async findAllOrderItems(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: GetOrderItemDto,
  ) {
    const { orderId, organizationSellerId, organizationBeyerId, model } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const orderItems = await this.orderItemsService.findAll({
      search,
      pagination,
      orderId,
      model,
      organizationBeyerId,
      organizationSellerId,
    });

    return reply({ res, results: orderItems });
  }

  /** Create Faq */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(@Res() res, @Req() req, @Body() body) {
    const { user } = req;
    const carts = await this.cartsService.findAll({
      cartOrderId: 'cecf3e89-93fc-4b26-ba55-daef929cc725',
      userId: user?.userId,
      status: 'ADDED',
    });
    const order = await this.ordersService.createOne({
      userId: carts?.summary?.userId,
      currency: carts?.summary?.currency,
      totalPriceDiscount: carts?.summary?.totalPriceDiscount,
      totalPriceNoDiscount: carts?.summary?.totalPriceNoDiscount,
    });

    for (const cart of carts?.cartItems) {
      await this.orderItemsService.createOne({
        userId: order?.userId,
        currency: order?.currency,
        quantity: Number(cart?.quantity),
        percentDiscount: cart?.product?.discount?.percent,
        price: Number(cart?.product?.price) * 100,
        priceDiscount: Number(cart?.product?.priceDiscount) * 100,
        organizationBeyerId: user?.organizationId,
        organizationSellerId: cart?.product?.organizationId,
        model: cart?.model,
        commissionId: cart?.commissionId,
        productId: cart?.productId,
        orderId: order?.id,
      });
    }

    return reply({ res, results: carts.cartItems });
  }
}
