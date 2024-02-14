import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { CookieAuthGuard } from '../users/middleware';
import { CreateOrUpdateFaqsDto } from './faqs.dto';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { FaqsService } from './faqs.service';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  /** Get all faqs */
  @Get(`/`)
  async findAll(
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
  @UseGuards(CookieAuthGuard)
  async getOneByUUID(@Res() res, @Param('faqId', ParseUUIDPipe) faqId: string) {
    const faq = await this.faqsService.findOneBy({ faqId });

    return reply({ res, results: faq });
  }

  /** Create Faq */
  @Post(`/`)
  @UseGuards(CookieAuthGuard)
  async createOne(@Res() res, @Req() req, @Body() body: CreateOrUpdateFaqsDto) {
    const { user } = req;
    const { title, status, description } = body;

    const faq = await this.faqsService.createOne({
      title,
      status,
      userCreatedId: user?.id,
      description,
    });

    return reply({ res, results: faq });
  }

  /** Update faq */
  @Put(`/:faqId`)
  @UseGuards(CookieAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateFaqsDto,
    @Param('faqId', ParseUUIDPipe) faqId: string,
  ) {
    const { title, status, description } = body;

    const findOneFaq = await this.faqsService.findOneBy({ faqId });
    if (!findOneFaq)
      throw new HttpException(
        `This faq ${faqId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const faq = await this.faqsService.updateOne(
      { faqId: findOneFaq?.id },
      { title, status, description },
    );

    return reply({ res, results: faq });
  }

  /** Delete faq */
  @Delete(`/:faqId`)
  @UseGuards(CookieAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('faqId', ParseUUIDPipe) faqId: string,
  ) {
    const findOneFaq = await this.faqsService.findOneBy({ faqId });
    if (!findOneFaq)
      throw new HttpException(
        `This faq ${faqId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const faq = await this.faqsService.updateOne(
      { faqId: findOneFaq?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: faq });
  }
}
