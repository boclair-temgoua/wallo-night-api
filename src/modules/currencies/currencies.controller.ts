import { Controller, UseGuards, Res, Get, Query } from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { CurrenciesService } from './currencies.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  /** Get all CurrenciesUs */
  @Get(`/`)
  async findAll(@Res() res, @Query() searchQuery: SearchQueryDto) {
    const { search } = searchQuery;

    const Currencies = await this.currenciesService.findAll({
      search,
    });

    return reply({ res, results: Currencies });
  }
}
