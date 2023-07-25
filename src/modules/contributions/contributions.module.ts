import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Contribution,
  Currency,
  Campaign,
  Gift,
  Transaction,
} from '../../models';
import { ContributionsService } from './contributions.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ContributionsController } from './contributions.controller';
import { GiftsService } from '../gifts/gifts.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CurrenciesService } from '../currencies/currencies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contribution,
      Campaign,
      Gift,
      Transaction,
      Currency,
    ]),
  ],
  controllers: [ContributionsController],
  providers: [
    ContributionsService,
    CampaignsService,
    GiftsService,
    CurrenciesService,
    TransactionsService,
  ],
})
export class ContributionsModule {}
