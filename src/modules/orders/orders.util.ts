import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersUtil {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartsService: CartsService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly cartOrdersService: CartOrdersService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  async orderCreate(options: {
    userBeyerId: string;
    cartOrderId: string;
    organizationSellerId: string;
  }): Promise<any> {
    const { userBeyerId, organizationSellerId, cartOrderId } = options;
    const findOneUser = await this.usersService.findOneBy({
      userId: userBeyerId,
    });
    if (!findOneUser) {
      throw new HttpException(
        `This user ${userBeyerId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    const findOneCartOrder = await this.cartOrdersService.findOneBy({
      cartOrderId,
      userId: userBeyerId,
      organizationSellerId,
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
      const orderItemCreate = await this.orderItemsService.createOne({
        userId: order?.userId,
        currency: order?.currency,
        quantity: Number(cart?.quantity),
        percentDiscount: cart?.product?.discount?.percent,
        price: Number(cart?.product?.price) * 100,
        priceDiscount: Number(cart?.product?.priceDiscount) * 100,
        organizationBeyerId: findOneUser?.organizationId,
        organizationSellerId: cart?.product?.organizationId,
        model: cart?.model,
        commissionId: cart?.commissionId,
        productId: cart?.productId,
        orderId: order?.id,
        status:
          findOneProduct?.productType === 'DIGITAL' ? 'DELIVERED' : 'PENDING',
      });

      if (orderItemCreate) {
        await this.cartsService.updateOne(
          { cartId: cart?.id },
          {
            status: 'COMPLETED',
            deletedAt: new Date(),
          },
        );
      }
    }

    return { order, user: findOneUser };
  }
}
