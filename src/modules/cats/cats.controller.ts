import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Ip,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { getIpRequest } from '../../app/utils/commons/get-ip-request';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../users/middleware';
import { CartsDto, CreateOrUpdateCartsDto } from './cats.dto';
import { CartsService } from './cats.service';

@Controller('carts')
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
    private readonly cartOrdersService: CartOrdersService,
  ) {}

  /** Get all Carts */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(@Res() res, @Req() req, @Ip() ip, @Query() query: CartsDto) {
    const ipLocation = getIpRequest(req);
    const { user } = req;
    const { cartOrderId } = query;

    const carts = await this.cartsService.findAll({
      userId: user?.id,
      status: 'ADDED',
      cartOrderId,
    });

    return reply({ res, results: carts });
  }

  /** Post one Carts */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCartsDto,
  ) {
    const { user } = req;
    const { productId, quantity } = body;
    const ipLocation = getIpRequest(req);

    const findOneProduct = await this.productsService.findOneBy({
      productId,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCartOrder =
      (await this.cartOrdersService.findOneBy({
        userId: user?.id,
        organizationSellerId: findOneProduct?.organizationId,
      })) ??
      (await this.cartOrdersService.createOne({
        userId: user?.id,
        organizationSellerId: findOneProduct?.organizationId,
      }));

    const findOneProductCart = await this.cartsService.findOneBy({
      productId,
      status: 'ADDED',
      userId: user?.id,
      currency: findOneProduct?.currency?.code,
      organizationSellerId: findOneProduct?.organizationId,
    });

    if (findOneProductCart) {
      await this.cartsService.updateOne(
        { cartId: findOneProductCart?.id },
        {
          productId,
          quantity: Number(
            Number(findOneProductCart?.quantity) + Number(quantity),
          ),
        },
      );
    } else {
      await this.cartsService.createOne({
        quantity,
        productId,
        userId: user?.id,
        ipLocation: ipLocation,
        cartOrderId: findOneCartOrder?.id,
        model: findOneProduct?.model,
        currency: findOneProduct?.currency?.code,
        organizationSellerId: findOneProduct?.organizationId,
      });
    }

    return reply({ res, results: 'Cart created successfully' });
  }

  /** Post one Carts */
  @Put(`/:cartId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Body() body: CreateOrUpdateCartsDto,
    @Param('cartId', ParseUUIDPipe) cartId: string,
  ) {
    const { productId, quantity } = body;

    const findOneProduct = await this.productsService.findOneBy({
      productId,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneCart = await this.cartsService.findOneBy({
      cartId,
    });
    if (!findOneCart)
      throw new HttpException(
        `Cart ${cartId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.cartsService.updateOne({ cartId }, { productId, quantity });

    return reply({ res, results: 'Cart updated successfully' });
  }

  /** Get one Carts */
  @Get(`/show/:cartId`)
  async getOne(@Res() res, @Param('cartId', ParseUUIDPipe) cartId: string) {
    const findOneCart = await this.cartsService.findOneBy({
      cartId,
    });
    if (!findOneCart)
      throw new HttpException(
        `Cart ${cartId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneCart });
  }

  /** Delete one Carts */
  @Delete(`/:cartId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('cartId', ParseUUIDPipe) cartId: string,
  ) {
    await this.cartsService.updateOne({ cartId }, { deletedAt: new Date() });

    return reply({ res, results: 'Cart deleted successfully' });
  }
}
