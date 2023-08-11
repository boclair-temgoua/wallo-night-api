import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Put,
  Res,
  Req,
  Get,
  Query,
  HttpStatus,
  HttpException,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { reply } from '../../app/utils/reply';
import { GalleriesService } from './galleries.service';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { JwtAuthGuard } from '../users/middleware';
import { CreateOrUpdateGalleriesDto } from './galleries.dto';
import {
  PaginationType,
  RequestPaginationDto,
  addPagination,
} from './../../app/utils/pagination';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import {
  formateNowDateYYMMDD,
  generateLongUUID,
} from '../../app/utils/commons';
import * as mime from 'mime-types';

@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  /** Get all Galleries */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() searchQuery: SearchQueryDto,
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query() requestPaginationDto: RequestPaginationDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const galleries = await this.galleriesService.findAll({
      search,
      userId,
      pagination,
    });

    return reply({ res, results: galleries });
  }

  /** Post one Galleries */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('attachment'))
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateGalleriesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const { title, whoCanSee, allowDownload, description } = body;

    console.log('file =======>', file);
    console.log('body =======>', body);
    // const nameFile = `${formateNowDateYYMMDD(new Date())}${generateLongUUID(
    //   8,
    // )}`;
    // await awsS3ServiceAdapter({
    //   name: nameFile,
    //   mimeType: file?.mimetype,
    //   folder: 'articles',
    //   file: file.buffer,
    // });
    // const extension = mime.extension(file.mimetype);
    // const fileName = `${nameFile}.${extension}`;

    await this.galleriesService.createOne({
      title,
      whoCanSee,
      description,
      allowDownload,
      userId: user?.id,
      // image: fileName,
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

    return reply({ res, results: 'gallery updated successfully' });
  }

  /** Delete gallery */
  @Delete(`/:galleryId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
  ) {
    const findOneGallery = await this.galleriesService.findOneBy({ galleryId });
    if (!findOneGallery)
      throw new HttpException(
        `This gallery ${galleryId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.galleriesService.updateOne(
      { galleryId: findOneGallery?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'gallery deleted successfully' });
  }
}
