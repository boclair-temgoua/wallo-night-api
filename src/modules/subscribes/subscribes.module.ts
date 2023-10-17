import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Subscribe,
  Follow,
  Membership,
  Transaction,
  Currency,
} from '../../models';
import { SubscribesController } from './subscribes.controller';
import { SubscribesService } from './subscribes.service';
import { FollowsService } from '../follows/follows.service';
import { MembershipsService } from '../memberships/memberships.service';
import { TransactionsService } from '../transactions/transactions.service';
import { SubscribesUtil } from './subscribes.util';
import { TransactionsUtil } from '../transactions/transactions.util';
import { CurrenciesService } from '../currencies/currencies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscribe,
      Follow,
      Membership,
      Transaction,
      Currency,
    ]),
  ],
  controllers: [SubscribesController],
  providers: [
    SubscribesService,
    FollowsService,
    SubscribesUtil,
    TransactionsUtil,
    CurrenciesService,
    MembershipsService,
    TransactionsService,
  ],
})
export class SubscribesModule {}
