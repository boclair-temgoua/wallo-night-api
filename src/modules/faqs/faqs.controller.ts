import {
  Controller,
  Post,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Put,
  Res,
  Req,
  Get,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { useCatch } from '../../app/utils/use-catch';
import { CreateOrUpdateFaqsDto } from './faqs.dto';
import { JwtAuthGuard } from '../users/middleware';

import { FaqsService } from './faqs.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  /** Get all faqs */
  @Get(`/`)
  async findAllFaqs(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const faqs = await this.faqsService.findAll({ search, pagination });

    return reply({ res, results: faqs });
  }

  /** Get one faq */
  @Get(`/show/:faqId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDFaq(
    @Res() res,
    @Param('faqId', ParseUUIDPipe) faqId: string,
  ) {
    const faq = await this.faqsService.findOneBy({ option1: { faqId } });

    return reply({ res, results: faq });
  }

  /** Create Faq */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneFaq(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateFaqsDto,
  ) {
    const { title, status, description } = body;

    const faq = await this.faqsService.createOne({
      title,
      status,
      description,
    });

    return reply({ res, results: faq });
  }

  /** Update faq */
  @Put(`/:faqId`)
  @UseGuards(JwtAuthGuard)
  async updateOneFaq(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateFaqsDto,
    @Param('faqId', ParseUUIDPipe) faqId: string,
  ) {
    const { title, status, description } = body;

    const findOneFaq = await this.faqsService.findOneBy({ option1: { faqId } });
    if (!findOneFaq)
      throw new HttpException(
        `This faq ${faqId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const faq = await this.faqsService.updateOne(
      { option1: { faqId: findOneFaq?.id } },
      { title, status, description },
    );

    return reply({ res, results: faq });
  }

  /** Delete faq */
  @Delete(`/:faqId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneFaq(
    @Res() res,
    @Req() req,
    @Param('faqId', ParseUUIDPipe) faqId: string,
  ) {
    const findOneFaq = await this.faqsService.findOneBy({ option1: { faqId } });
    if (!findOneFaq)
      throw new HttpException(
        `This faq ${faqId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const faq = await this.faqsService.updateOne(
      { option1: { faqId: findOneFaq?.id } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: faq });
  }
}
