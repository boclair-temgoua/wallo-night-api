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
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
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
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const categories = await this.categoriesService.findAll({
      search,
      pagination,
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
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const CategoriesUs = await this.categoriesService.findAll({
      search,
      pagination,
      option1: { organizationId: user?.organizationInUtilizationId },
    });

    return reply({ res, results: CategoriesUs });
  }

  /** Post one Categories */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneCategory(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateCategoriesUsDto: CreateOrUpdateCategoriesUsDto,
  ) {
    const { user } = req;
    const { name, description } = createOrUpdateCategoriesUsDto;

    const findOneCategory = await this.categoriesService.findOneBy({
      option2: { name, organizationId: user?.organizationInUtilizationId },
    });
    if (findOneCategory)
      throw new HttpException(
        `Name ${name} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const category = await this.categoriesService.createOne({
      name,
      description,
      userCreatedId: user?.id,
      organizationId: user?.organizationInUtilizationId,
    });

    return reply({ res, results: category });
  }

  /** Post one Categories */
  @Put(`/:categoryId`)
  @UseGuards(JwtAuthGuard)
  async updateOneCategory(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateCategoriesUsDto: CreateOrUpdateCategoriesUsDto,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    const { name, description } = createOrUpdateCategoriesUsDto;

    const category = await this.categoriesService.updateOne(
      { option1: { categoryId } },
      { name, description },
    );

    return reply({ res, results: category });
  }

  /** Get one Categories */
  @Get(`/show/:categoryId`)
  @UseGuards(JwtAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    const category = await this.categoriesService.findOneBy({
      option1: { categoryId },
    });

    return reply({ res, results: category });
  }

  /** Delete one CategoriesUs */
  @Delete(`/delete/:categoryId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneCategoriesUs(
    @Res() res,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    const category = await this.categoriesService.updateOne(
      { option1: { categoryId } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: category });
  }
}
