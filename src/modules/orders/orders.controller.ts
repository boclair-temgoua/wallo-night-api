import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
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
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { ProductsService } from '../products/products.service';
import { UserAuthGuard } from '../users/middleware';
import { GetOrderItemDto, UpdateOrderItemDto } from './orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
    private readonly cartOrdersService: CartOrdersService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  @Get(`/`)
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
  async findAllOrderItems(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: GetOrderItemDto,
  ) {
    const {
      orderId,
      userId,
      organizationSellerId,
      organizationBeyerId,
      model,
    } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const orderItems = await this.orderItemsService.findAll({
      search,
      pagination,
      orderId,
      model,
      userId,
      organizationBeyerId,
      organizationSellerId,
    });

    return reply({ res, results: orderItems });
  }

  /** Create Order */
  @Post(`/:cartOrderId`)
  @UseGuards(UserAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Param('cartOrderId', ParseUUIDPipe) cartOrderId: string,
  ) {
    const { user } = req;

    const findOneCartOrder = await this.cartOrdersService.findOneBy({
      cartOrderId,
      //userId: '53019e77-de96-4ac7-9464-da32a9a37d4b',
    });
    if (!findOneCartOrder) {
      throw new HttpException(
        `This order ${cartOrderId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    const carts = await this.cartsService.findAll({
      status: 'ADDED',
      userId: findOneCartOrder?.userId,
      cartOrderId: findOneCartOrder?.id,
    });
    if (!carts?.summary?.userId) {
      throw new HttpException(
        `Carts dons't exist please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    const order = await this.ordersService.createOne({
      userId: carts?.summary?.userId,
      currency: carts?.summary?.currency,
      totalPriceDiscount: carts?.summary?.totalPriceDiscount,
      totalPriceNoDiscount: carts?.summary?.totalPriceNoDiscount,
    });

    for (const cart of carts?.cartItems) {
      const findOneProduct = await this.productsService.findOneBy({
        productId: cart.productId,
      });
      if (!findOneProduct) {
        false;
      }
      console.log('findOneProduct =====>', findOneProduct);
      const orderItemCreate = await this.orderItemsService.createOne({
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
        uploadFiles: [...findOneProduct?.uploadsFiles],
        status:
          findOneProduct?.productType === 'DIGITAL' ? 'ACCEPTED' : 'PENDING',
      });

      // if (orderItemCreate) {
      //   await this.cartsService.updateOne(
      //     { cartId: cart?.id },
      //     {
      //       status: 'COMPLETED',
      //       deletedAt: new Date(),
      //     },
      //   );
      // }
    }

    return reply({ res, results: carts?.cartItems });
  }

  /** Create OrderItem */
  @Put(`/order-items/:orderItemId`)
  @UseGuards(UserAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: UpdateOrderItemDto,
    @Param('orderItemId', ParseUUIDPipe) orderItemId: string,
  ) {
    const { status } = body;
    const { user } = req;
    const findOneOrderItem = await this.orderItemsService.findOneBy({
      orderItemId,
      organizationSellerId: user?.organizationId,
    });
    if (!findOneOrderItem)
      throw new HttpException(
        `This order item ${orderItemId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.orderItemsService.updateOne({ orderItemId }, { status });

    return reply({ res, results: 'orderItem updated successfully' });
  }
}
