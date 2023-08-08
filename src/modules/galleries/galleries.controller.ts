import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Res,
  Req,
  Get,
  Query,
  HttpStatus,
  HttpException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { GalleriesService } from './galleries.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { JwtAuthGuard } from '../users/middleware';
import { CreateOrUpdateGalleriesDto } from './galleries.dto';

@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  /** Get all Galleries */
  @Get(`/`)
  async findAll(@Res() res, @Query() searchQuery: SearchQueryDto) {
    const { search } = searchQuery;

    const galleries = await this.galleriesService.findAll({
      search,
    });

    return reply({ res, results: galleries });
  }

  /** Post one Galleries */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateGalleriesDto,
  ) {
    const { user } = req;
    const { title, whoCanSee, allowDownload, description } = body;

    await this.galleriesService.createOne({
      title,
      whoCanSee,
      description,
      allowDownload,
      userId: user?.id,
    });

    return reply({ res, results: 'Gallery created successfully' });
  }

  /** Post one Galleries */
  @Put(`/:galleryId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateGalleriesDto,
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
  ) {
    const { title, whoCanSee, allowDownload, description } = body;

    const findOneGift = await this.galleriesService.findOneBy({
      galleryId,
    });
    if (!findOneGift)
      throw new HttpException(
        `Gallery ${galleryId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.galleriesService.updateOne(
      { galleryId },
      {
        title,
        whoCanSee,
        description,
        allowDownload,
      },
    );

    return reply({ res, results: 'Gallery updated successfully' });
  }
}
