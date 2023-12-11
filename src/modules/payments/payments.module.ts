import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { FollowsService } from '../follows/follows.service';
import { MembershipsService } from '../memberships/memberships.service';
import { TransactionsService } from '../transactions/transactions.service';
import {
  Subscribe,
  Follow,
  Membership,
  Transaction,
  Wallet,
  Cart,
  Comment,
  Currency,
  Payment,
} from '../../models';
import { SubscribesService } from '../subscribes/subscribes.service';
import { WalletsService } from '../wallets/wallets.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { TransactionsUtil } from '../transactions/transactions.util';
import { CommentsService } from '../comments/comments.service';
import { CartsService } from '../cats/cats.service';
import { PaymentsTransactionController } from './payments-transaction.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscribe,
      Follow,
      Membership,
      Wallet,
      Cart,
      Comment,
      Currency,
      Payment,
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
    CommentsService,
    TransactionsUtil,
    CurrenciesService,
    MembershipsService,
    TransactionsService,
  ],
})
export class PaymentsModule {}
