import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { config } from '../../app/config/index';
import { CurrenciesUtil } from '../currencies/currencies.util';

@Injectable()
export class JobsService {
  constructor(private readonly currenciesUtil: CurrenciesUtil) {}

  @Cron(' * * 23 * 7')
  async currenciesCron() {
    config.job.start === 'true' &&
      (await this.currenciesUtil.updateCurrencies());
  }
}
