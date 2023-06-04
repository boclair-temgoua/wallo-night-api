import { Controller, UseGuards, Res, Get, Query } from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { CountriesService } from './countries.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

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
