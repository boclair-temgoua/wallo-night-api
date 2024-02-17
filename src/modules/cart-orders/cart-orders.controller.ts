import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { UserAuthGuard } from '../users/middleware';
import { CartOrdersDto } from './cart-orders.dto';
import { CartOrdersService } from './cart-orders.service';

@Controller('cart-orders')
export class CartOrderController {
  constructor(private readonly cartOrdersService: CartOrdersService) {}

  @Get(`/view`)
  @UseGuards(UserAuthGuard)
  async getOne(@Res() res, @Req() req, @Query() query: CartOrdersDto) {
    const { user } = req;
    const { cartOrderId, organizationSellerId } = query;

    const findCartOrder = await this.cartOrdersService.findOneBy({
      userId: user?.id,
      cartOrderId,
      organizationSellerId,
    });

    return reply({ res, results: findCartOrder });
  }
}
