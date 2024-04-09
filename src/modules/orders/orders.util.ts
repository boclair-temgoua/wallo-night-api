import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterQueryType } from '../../app/utils/search-query';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { ProductsService } from '../products/products.service';
import { AmountModel } from '../wallets/wallets.type';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersUtil {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
    private readonly cartOrdersService: CartOrdersService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  /** Create shop */
  async orderShopCreate(options: {
    userBuyerId: string;
    cartOrderId: string;
    organizationBuyerId: string;
    organizationSellerId: string;
    userAddress?: any;
  }): Promise<any> {
    const {
      userAddress,
      userBuyerId,
      organizationBuyerId,
      organizationSellerId,
      cartOrderId,
    } = options;

    const findOneCartOrder = await this.cartOrdersService.findOneBy({
      cartOrderId,
      userId: userBuyerId,
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
      address: userAddress,
      userId: carts?.summary?.userId,
      currency: carts?.summary?.currency,
      totalPriceDiscount: Number(carts?.summary?.totalPriceDiscount) * 100,
      totalPriceNoDiscount: Number(carts?.summary?.totalPriceNoDiscount) * 100,
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
        price: Number(cart?.product?.price) * Number(cart?.quantity) * 100,
        priceDiscount:
          Number(cart?.product?.priceDiscount) * Number(cart?.quantity) * 100,
        organizationBuyerId: organizationBuyerId,
        organizationSellerId: cart?.product?.organizationId,
        model: cart?.model,
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

  /** Create commission */
  async orderCommissionOrMembershipCreate(options: {
    model: FilterQueryType;
    amount: AmountModel;
    userBuyerId: string;
    productId?: string;
    membershipId?: string;
    organizationBuyerId: string;
    organizationSellerId: string;
    userAddress?: any;
  }): Promise<any> {
    const {
      model,
      amount,
      productId,
      membershipId,
      userAddress,
      userBuyerId,
      organizationBuyerId,
      organizationSellerId,
    } = options;

    const order = await this.ordersService.createOne({
      address: userAddress,
      userId: userBuyerId,
      currency: amount?.currency,
      totalPriceDiscount: Number(amount?.value) * 100,
      totalPriceNoDiscount: Number(amount?.value) * 100,
    });
    const orderItem = await this.orderItemsService.createOne({
      userId: order?.userId,
      currency: order?.currency,
      quantity: 1,
      price: Number(amount?.value) * 100,
      organizationBuyerId: organizationBuyerId,
      organizationSellerId: organizationSellerId,
      model: model,
      productId: productId,
      membershipId: membershipId,
      orderId: order?.id,
      status: 'DELIVERED',
    });

    return { order, orderItem };
  }
}
