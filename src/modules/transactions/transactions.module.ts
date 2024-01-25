import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency, Transaction } from '../../models';
import { CurrenciesService } from '../currencies/currencies.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsUtil } from './transactions.util';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Currency])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsUtil, CurrenciesService],
})
export class TransactionsModule {}
