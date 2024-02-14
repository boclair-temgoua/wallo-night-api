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

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CookieAuthGuard } from '../users/middleware';
import { CreateOrUpdateAlbumsDto } from './albums.dto';
import { AlbumsService } from './albums.service';

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
  @UseGuards(CookieAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateAlbumsDto,
  ) {
    const { user } = req;
    const { name, description } = body;

    const album = await this.albumsService.createOne({
      name,
      description,
      userId: user?.id,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: album });
  }

  /** Post one Albums */
  @Put(`/:albumId`)
  @UseGuards(CookieAuthGuard)
  async updateOneAlbum(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateAlbumsDto,
    @Param('albumId', ParseUUIDPipe) albumId: string,
  ) {
    const { name, description } = body;

    const findOneAlbum = await this.albumsService.findOneBy({
      albumId,
    });
    if (!findOneAlbum)
      throw new HttpException(
        `Album ${albumId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const album = await this.albumsService.updateOne(
      { albumId },
      { name, description },
    );

    return reply({ res, results: album });
  }

  /** Get one Albums */
  @Get(`/show/:albumId`)
  @UseGuards(CookieAuthGuard)
  async getOne(@Res() res, @Param('albumId', ParseUUIDPipe) albumId: string) {
    const findOneAlbum = await this.albumsService.findOneBy({
      albumId,
    });
    if (!findOneAlbum)
      throw new HttpException(
        `Album ${albumId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneAlbum });
  }

  /** Delete one Album */
  @Delete(`/:albumId`)
  @UseGuards(CookieAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('albumId', ParseUUIDPipe) albumId: string,
  ) {
    await this.albumsService.updateOne({ albumId }, { deletedAt: new Date() });

    return reply({ res, results: 'album deleted successfully' });
  }
}
