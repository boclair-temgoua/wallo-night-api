import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation, Currency } from '../../models';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { CurrenciesService } from '../currencies/currencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donation, Currency])],
  controllers: [DonationsController],
  providers: [DonationsService, CurrenciesService],
})
export class DonationsModule {}
