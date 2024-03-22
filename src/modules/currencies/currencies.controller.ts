import { Controller, Get, Query, Res } from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { SearchQueryDto } from '../../app/utils/search-query';
import { CurrenciesService } from './currencies.service';
import { CurrenciesUtil } from './currencies.util';

@Controller('currencies')
export class CurrenciesController {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly currenciesUtil: CurrenciesUtil,
  ) {}

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
    const currencies = await this.currenciesUtil.updateCurrencies();

    return reply({ res, results: currencies });
  }
}
