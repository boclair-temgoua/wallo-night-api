import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet, Currency } from '../../models';
import { WalletsService } from './wallets.service';
import { CurrenciesService } from '../currencies/currencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [],
  providers: [WalletsService],
})
export class WalletsModule {}
