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

import {
  PaginationType,
  RequestPaginationDto,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { UserAuthGuard } from '../users/middleware';
import { CreateOrUpdateCategoriesDto } from './categories.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Get all Categories */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() searchQuery: SearchQueryDto,
    @Query() requestPaginationDto: RequestPaginationDto,
  ) {
    const { search, organizationId } = searchQuery;

    const { take, page, sort, isPaginate } = requestPaginationDto;
    const pagination: PaginationType = addPagination({
      page,
      take,
      sort,
      isPaginate,
    });

    const categories = await this.categoriesService.findAll({
      search,
      pagination,
      organizationId: organizationId,
    });

    return reply({ res, results: categories });
  }

  /** Post one Categories */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCategoriesDto,
  ) {
    const { user } = req;
    const { name, description } = body;

    const category = await this.categoriesService.createOne({
      name,
      description,
      userId: user?.id,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: category });
  }

  /** Post one Categories */
  @Put(`/:categoryId`)
  @UseGuards(UserAuthGuard)
  async updateOneCategory(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCategoriesDto,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    const { name, description } = body;

    const findOneCategory = await this.categoriesService.findOneBy({
      categoryId,
    });
    if (!findOneCategory)
      throw new HttpException(
        `Category ${categoryId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const category = await this.categoriesService.updateOne(
      { categoryId },
      { name, description },
    );

    return reply({ res, results: category });
  }

  /** Get one Categories */
  @Get(`/show/:categoryId`)
  @UseGuards(UserAuthGuard)
  async getOne(
    @Res() res,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    const findOneCategory = await this.categoriesService.findOneBy({
      categoryId,
    });
    if (!findOneCategory)
      throw new HttpException(
        `Category ${categoryId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneCategory });
  }

  /** Delete one CategoriesUs */
  @Delete(`/:categoryId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    await this.categoriesService.updateOne(
      { categoryId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'category deleted successfully' });
  }
}
