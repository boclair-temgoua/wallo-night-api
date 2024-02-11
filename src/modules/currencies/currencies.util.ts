import { Injectable } from '@nestjs/common';
import { getValueCurrencyLiveApi } from '../integrations/taux-live';
import { CurrenciesService } from './currencies.service';
import { CurrencySymbolMap, currenciesCodeArrays } from './currencies.type';

@Injectable()
export class CurrenciesUtil {
  constructor(private readonly currenciesService: CurrenciesService) {}

  /** Create one Currency to the database. */
  async updateCurrencies() {
    const { rates } = await getValueCurrencyLiveApi();
    const currencies = currenciesCodeArrays;

    for (const currency of currenciesCodeArrays) {
      const newCurrency = currency?.toUpperCase();
      const findOneCurrency = await this.currenciesService.findOneBy({
        code: newCurrency,
      });
      if (findOneCurrency) {
        await this.currenciesService.updateOne(
          { currencyId: findOneCurrency?.id },
          {
            amount: Number(rates[newCurrency]) || 0,
            name: CurrencySymbolMap[newCurrency]?.name,
            symbol: CurrencySymbolMap[newCurrency]?.symbol,
          },
        );
      } else {
        await this.currenciesService.createOne({
          code: newCurrency,
          amount: Number(rates[newCurrency]) || 0,
          name: CurrencySymbolMap[newCurrency]?.name,
          symbol: CurrencySymbolMap[newCurrency]?.symbol,
        });
      }
    }
    return currencies;
  }
}
