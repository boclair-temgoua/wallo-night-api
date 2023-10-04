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
} from '../../models';
import { SubscribesService } from '../subscribes/subscribes.service';
import { WalletsService } from '../wallets/wallets.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscribe,
      Follow,
      Membership,
      Wallet,
      Transaction,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    SubscribesService,
    SubscribesUtil,
    FollowsService,
    SubscribesUtil,
    WalletsService,
    MembershipsService,
    TransactionsService,
  ],
})
export class PaymentsModule {}
