import {
  Controller,
  Post,
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

import { CategoriesService } from './categories.service';
import {
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateCategoriesUsDto } from './categories.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Get all CategoriesUs */
  @Get(`/all`)
  @UseGuards(JwtAuthGuard)
  async findAllCategories(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() is_paginate: boolean,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const categories = await this.categoriesService.findAll({
      search,
      pagination,
      is_paginate,
    });

    return reply({ res, results: categories });
  }

  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllByOrganizationId(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query('is_paginate') is_paginate: boolean,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const categories = await this.categoriesService.findAll({
      search,
      pagination,
      is_paginate,
    });

    return reply({ res, results: categories });
  }

  /** Post one Categories */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneCategory(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCategoriesUsDto,
  ) {
    const { user } = req;
    const { name, description } = body;

    const category = await this.categoriesService.createOne({
      name,
      description,
      userCreatedId: user?.id,
    });

    return reply({ res, results: category });
  }

  /** Post one Categories */
  @Put(`/:categoryId`)
  @UseGuards(JwtAuthGuard)
  async updateOneCategory(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCategoriesUsDto,
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
  @UseGuards(JwtAuthGuard)
  async getOneCategory(
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
  @Delete(`/delete/:categoryId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneCategory(
    @Res() res,
    @Req() req,
    @Body() body: PasswordBodyDto,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    const { user } = req;
    const { password } = body;
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const category = await this.categoriesService.updateOne(
      { categoryId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: category });
  }
}
