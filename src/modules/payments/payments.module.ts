import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    Cart,
    CartOrder,
    Comment,
    Currency,
    Follow,
    Order,
    OrderItem,
    Payment,
    Product,
    Transaction,
    User,
    Wallet,
} from '../../models';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { CommentsService } from '../comments/comments.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { FollowsService } from '../follows/follows.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersUtil } from '../orders/orders.util';
import { ProductsService } from '../products/products.service';
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
            Follow,
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
            CartOrder,
            Transaction,
        ]),
    ],
    controllers: [PaymentsController, PaymentsTransactionController],
    providers: [
        PaymentsService,
        FollowsService,
        WalletsService,
        CartsService,
        OrdersUtil,
        OrdersService,
        UsersService,
        PaymentsUtil,
        CartOrdersService,
        OrderItemsService,
        ProductsService,
        CommentsService,
        TransactionsUtil,
        CurrenciesService,
        TransactionsService,
    ],
})
export class PaymentsModule {}
