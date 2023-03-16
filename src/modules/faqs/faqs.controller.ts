import {
  Controller,
  Post,
  Response,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Request,
  Put,
  Res,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { useCatch } from '../../app/utils/use-catch';
import { CreateOrUpdateFaqsDto } from './faqs.dto';
//import { JwtAuthGuard } from '../../user/middleware';

import { FaqsService } from './faqs.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { JwtAuthGuard } from '../users/middleware';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get(`/`)
  async findAllFaqs(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const [errors, results] = await useCatch(
      this.faqsService.findAll({ search, pagination }),
    );
    if (errors) {
      throw new NotFoundException(errors);
    }
    return reply({ res, results });
  }

  @Get(`/show/:faqId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDFaq(
    @Res() res,
    @Param('faqId', ParseUUIDPipe) faqId: string,
  ) {
    const [error, result] = await useCatch(
      this.faqsService.findOneBy({ option1: { faqId } }),
    );

    if (error) {
      throw new NotFoundException(error);
    }
    return reply({ res, results: result });
  }

  @Post(`/create`)
  @UseGuards(JwtAuthGuard)
  async createOneFaq(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateFaqDto: CreateOrUpdateFaqsDto,
  ) {
    //const { user } = req;

    const [error, faq] = await useCatch(
      this.faqsService.createOne({ ...createOrUpdateFaqDto }),
    );
    if (error) throw new NotFoundException(error);

    return reply({ res, results: faq });
  }
}
