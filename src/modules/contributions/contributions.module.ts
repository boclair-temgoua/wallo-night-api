import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution, Donation, Gift, Transaction } from '../../models';
import { ContributionsService } from './contributions.service';
import { DonationsService } from '../donations/donations.service';
import { ContributionsController } from './contributions.controller';
import { GiftsService } from '../gifts/gifts.service';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, Donation, Gift, Transaction]),
  ],
  controllers: [ContributionsController],
  providers: [
    ContributionsService,
    DonationsService,
    GiftsService,
    TransactionsService,
  ],
})
export class ContributionsModule {}
