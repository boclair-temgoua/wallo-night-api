import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, Currency } from '../../models';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsUtil } from './transactions.util';
import { CurrenciesService } from '../currencies/currencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Currency])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsUtil, CurrenciesService],
})
export class TransactionsModule {}
