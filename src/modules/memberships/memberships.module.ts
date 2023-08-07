import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from '../../models/Membership';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { Currency } from '../../models/Currency';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, Currency])],
  controllers: [MembershipsController],
  providers: [MembershipsService, CurrenciesService],
})
export class MembershipsModule {}
