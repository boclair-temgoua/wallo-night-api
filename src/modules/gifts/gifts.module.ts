import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gift } from '../../models/Gift';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { Currency } from '../../models/Currency';

@Module({
  imports: [TypeOrmModule.forFeature([Gift, Currency])],
  controllers: [GiftsController],
  providers: [GiftsService, CurrenciesService],
})
export class GiftsModule {}
