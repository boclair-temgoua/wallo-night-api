import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Cart,
  CartOrder,
  Currency,
  Follow,
  Membership,
  Order,
  OrderItem,
  Product,
  Subscribe,
  Transaction,
} from '../../models';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { FollowsService } from '../follows/follows.service';
import { MembershipsService } from '../memberships/memberships.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersUtil } from '../orders/orders.util';
import { ProductsService } from '../products/products.service';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsUtil } from '../transactions/transactions.util';
import { SubscribesController } from './subscribes.controller';
import { SubscribesService } from './subscribes.service';
import { SubscribesUtil } from './subscribes.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscribe,
      Follow,
      Membership,
      Transaction,
      Currency,
      Order,
      Cart,
      CartOrder,
      Product,
      OrderItem,
    ]),
  ],
  controllers: [SubscribesController],
  providers: [
    SubscribesService,
    FollowsService,
    OrdersUtil,
    OrdersService,
    CartsService,
    ProductsService,
    SubscribesUtil,
    OrderItemsService,
    CartOrdersService,
    TransactionsUtil,
    CurrenciesService,
    MembershipsService,
    TransactionsService,
  ],
})
export class SubscribesModule {}
