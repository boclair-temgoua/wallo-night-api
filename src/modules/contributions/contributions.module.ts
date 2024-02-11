import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Contribution,
  Currency,
  Transaction,
  User,
  Wallet,
} from '../../models';
import { BullingService } from '../bulling/bulling.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contribution,
      User,
      Wallet,
      Transaction,
      Currency,
    ]),
  ],
  controllers: [ContributionsController],
  providers: [
    ContributionsService,
    UsersService,
    WalletsService,
    BullingService,
    CurrenciesService,
    TransactionsService,
  ],
})
export class ContributionsModule {}
