import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../../models/Currency';
import { CurrenciesService } from '../currencies/currencies.service';
import { CurrenciesUtil } from '../currencies/currencies.util';
import { JobsService } from './jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  controllers: [],
  providers: [JobsService, CurrenciesUtil, CurrenciesService],
})
export class JobsModule {}
