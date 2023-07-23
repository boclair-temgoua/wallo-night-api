import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution, Donation, Gift } from '../../models';
import { ContributionsService } from './contributions.service';
import { DonationsService } from '../donations/donations.service';
import { ContributionsController } from './contributions.controller';
import { GiftsService } from '../gifts/gifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution, Donation, Gift])],
  controllers: [ContributionsController],
  providers: [ContributionsService, DonationsService, GiftsService],
})
export class ContributionsModule {}
