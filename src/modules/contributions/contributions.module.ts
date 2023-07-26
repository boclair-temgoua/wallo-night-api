import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Contribution,
  Currency,
  Campaign,
  Gift,
  User,
  Transaction,
  Wallet,
} from '../../models';
import { ContributionsService } from './contributions.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ContributionsController } from './contributions.controller';
import { GiftsService } from '../gifts/gifts.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { BullingService } from '../bulling/bulling.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contribution,
      Campaign,
      Gift,
      User,
      Wallet,
      Transaction,
      Currency,
    ]),
  ],
  controllers: [ContributionsController],
  providers: [
    ContributionsService,
    CampaignsService,
    GiftsService,
    UsersService,
    WalletsService,
    BullingService,
    CurrenciesService,
    TransactionsService,
  ],
})
export class ContributionsModule {}
