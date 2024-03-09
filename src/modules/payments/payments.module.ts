import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Cart,
  CartOrder,
  Comment,
  Commission,
  Currency,
  Follow,
  Membership,
  Order,
  OrderItem,
  Payment,
  Product,
  Subscribe,
  Transaction,
  User,
  Wallet,
} from '../../models';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { CommentsService } from '../comments/comments.service';
import { CommissionsService } from '../commissions/commissions.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { FollowsService } from '../follows/follows.service';
import { MembershipsService } from '../memberships/memberships.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersUtil } from '../orders/orders.util';
import { ProductsService } from '../products/products.service';
import { SubscribesService } from '../subscribes/subscribes.service';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsUtil } from '../transactions/transactions.util';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { PaymentsTransactionController } from './payments-transaction.controller';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsUtil } from './payments.util';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscribe,
      Follow,
      Membership,
      Wallet,
      Cart,
      Order,
      User,
      Comment,
      Currency,
      Payment,
      Product,
      OrderItem,
      Cart,
      Commission,
      CartOrder,
      Transaction,
    ]),
  ],
  controllers: [PaymentsController, PaymentsTransactionController],
  providers: [
    PaymentsService,
    SubscribesService,
    SubscribesUtil,
    FollowsService,
    SubscribesUtil,
    WalletsService,
    CartsService,
    OrdersUtil,
    OrdersService,
    UsersService,
    PaymentsUtil,
    CommissionsService,
    CartOrdersService,
    OrderItemsService,
    ProductsService,
    CommentsService,
    TransactionsUtil,
    CurrenciesService,
    MembershipsService,
    TransactionsService,
  ],
})
export class PaymentsModule {}
