import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from '../../models/Donation';
import { GiftsController } from './donations.controller';
import { DonationsService } from './donations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donation])],
  controllers: [GiftsController],
  providers: [DonationsService],
})
export class DonationsModule {}
