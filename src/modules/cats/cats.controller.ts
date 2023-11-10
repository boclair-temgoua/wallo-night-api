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
  Ip,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { CartsService } from './cats.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { CartsDto, CreateOrUpdateCartsDto, StatusCart } from './cats.dto';
import { ProductsService } from '../products/products.service';
import { getIpRequest } from '../../app/utils/commons/get-ip-request';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { query } from 'express';

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
        organizationId: findOneProduct?.organizationId,
      })) ??
      (await this.cartOrdersService.createOne({
        userId: user?.id,
        organizationId: findOneProduct?.organizationId,
      }));

    const findOneProductCart = await this.cartsService.findOneBy({
      productId,
      userId: user?.id,
      status: 'ADDED',
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
        ipLocation: ipLocation,
        userId: user?.id,
        cartOrderId: findOneCartOrder?.id,
        organizationId: findOneProduct?.organizationId,
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
