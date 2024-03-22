import { Controller, Get, Query, Res } from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { SearchQueryDto } from '../../app/utils/search-query';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  /** Get all countriesUs */
  @Get(`/`)
  async findAll(@Res() res, @Query() searchQuery: SearchQueryDto) {
    const { search } = searchQuery;

    const countries = await this.countriesService.findAll({
      search,
    });

    return reply({ res, results: countries });
  }
}
