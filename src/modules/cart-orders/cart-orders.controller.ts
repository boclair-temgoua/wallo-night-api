import {
  Controller,
  ParseUUIDPipe,
  UseGuards,
  Res,
  Get,
  Req,
  Query,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { CartOrdersService } from './cart-orders.service';
import { JwtAuthGuard } from '../users/middleware';
import { CartOrdersDto } from './cart-orders.dto';

@Controller('cart-orders')
export class CartOrderController {
  constructor(private readonly cartOrdersService: CartOrdersService) {}

  @Get(`/view`)
  @UseGuards(JwtAuthGuard)
  async getOne(@Res() res, @Req() req, @Query() query: CartOrdersDto) {
    const { user } = req;
    const { cartOrderId, organizationId } = query;

    const findCartOrder = await this.cartOrdersService.findOneBy({
      userId: user?.id,
      cartOrderId,
      organizationId,
    });

    return reply({ res, results: findCartOrder });
  }
}
