import { Controller, UseGuards, Res, Get, Query } from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { CurrenciesService } from './currencies.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { currenciesCodeArrays, CurrencySymbolMap } from './currencies.type';
import { getValueCurrencyLiveApi } from '../integrations/taux-live';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  /** Get all CurrenciesUs */
  @Get(`/`)
  async findAll(@Res() res, @Query() searchQuery: SearchQueryDto) {
    const { search } = searchQuery;

    const currencies = await this.currenciesService.findAll({
      search,
    });

    return reply({ res, results: currencies });
  }

  /** Get all CurrenciesUs */
  @Get(`/upgrade`)
  async upgrade(@Res() res, @Query() searchQuery: SearchQueryDto) {
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

    return reply({ res, results: currencies });
  }
}
