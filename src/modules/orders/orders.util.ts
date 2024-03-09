import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { AmountModel } from '../wallets/wallets.type';
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

  async orderShopCreate(options: {
    userBeyerId: string;
    cartOrderId: string;
    organizationBuyerId: string;
    organizationSellerId: string;
    userAddress?: any;
  }): Promise<any> {
    const {
      userAddress,
      userBeyerId,
      organizationBuyerId,
      organizationSellerId,
      cartOrderId,
    } = options;

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
      address: userAddress,
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
        organizationBuyerId: organizationBuyerId,
        organizationSellerId: cart?.product?.organizationId,
        model: cart?.model,
        commissionId: cart?.commissionId,
        productId: cart?.productId,
        orderId: order?.id,
        uploadFiles: [...findOneProduct?.uploadsFiles],
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

    return { order };
  }

  async orderShopCommission(options: {
    amount: AmountModel;
    userBeyerId: string;
    commissionId: string;
    organizationBuyerId: string;
    organizationSellerId: string;
    userAddress?: any;
  }): Promise<any> {
    const {
      amount,
      commissionId,
      userAddress,
      userBeyerId,
      organizationBuyerId,
      organizationSellerId,
    } = options;

    const order = await this.ordersService.createOne({
      userId: userBeyerId,
      currency: amount?.currency,
      address: userAddress,
      totalPriceDiscount: Number(amount?.value),
      totalPriceNoDiscount: Number(amount?.value),
    });
    const orderItem = await this.orderItemsService.createOne({
      userId: order?.userId,
      currency: order?.currency,
      quantity: 1,
      price: Number(amount?.value) * 100,
      organizationBuyerId: organizationBuyerId,
      organizationSellerId: organizationSellerId,
      model: 'COMMISSION',
      commissionId: commissionId,
      orderId: order?.id,
      status: 'DELIVERED',
    });

    return { order, orderItem };
  }
}
