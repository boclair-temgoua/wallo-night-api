import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign, Currency } from '../../models';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { CurrenciesService } from '../currencies/currencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Currency])],
  controllers: [CampaignsController],
  providers: [CampaignsService, CurrenciesService],
})
export class CampaignsModule {}
