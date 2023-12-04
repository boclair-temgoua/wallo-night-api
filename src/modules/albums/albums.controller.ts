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

import { AlbumsService } from './albums.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateAlbumsDto } from './albums.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  /** Get all Albums */
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

    const Albums = await this.albumsService.findAll({
      search,
      pagination,
      organizationId: organizationId,
    });

    return reply({ res, results: Albums });
  }

  /** Post one Albums */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateAlbumsDto,
  ) {
    const { user } = req;
    const { name, description } = body;

    const category = await this.albumsService.createOne({
      name,
      description,
      userId: user?.id,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: category });
  }

  /** Post one Albums */
  @Put(`/:albumId`)
  @UseGuards(JwtAuthGuard)
  async updateOneCategory(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateAlbumsDto,
    @Param('albumId', ParseUUIDPipe) albumId: string,
  ) {
    const { name, description } = body;

    const findOneCategory = await this.albumsService.findOneBy({
      albumId,
    });
    if (!findOneCategory)
      throw new HttpException(
        `Album ${albumId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const category = await this.albumsService.updateOne(
      { albumId },
      { name, description },
    );

    return reply({ res, results: category });
  }

  /** Get one Albums */
  @Get(`/show/:albumId`)
  @UseGuards(JwtAuthGuard)
  async getOne(@Res() res, @Param('albumId', ParseUUIDPipe) albumId: string) {
    const findOneCategory = await this.albumsService.findOneBy({
      albumId,
    });
    if (!findOneCategory)
      throw new HttpException(
        `Category ${albumId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneCategory });
  }

  /** Delete one Album */
  @Delete(`/:albumId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('albumId', ParseUUIDPipe) albumId: string,
  ) {
    await this.albumsService.updateOne({ albumId }, { deletedAt: new Date() });

    return reply({ res, results: 'category deleted successfully' });
  }
}
