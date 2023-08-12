import { config } from './../../app/config/index';
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
import {
  awsS3ServiceAdapter,
  getFileToAws,
} from '../integrations/aws/aws-s3-service-adapter';
import {
  formateNowDateYYMMDD,
  generateLongUUID,
} from '../../app/utils/commons';
import * as mime from 'mime-types';
import axios from 'axios';

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

    const nameFile = `${formateNowDateYYMMDD(new Date())}${generateLongUUID(
      8,
    )}`;

    await awsS3ServiceAdapter({
      name: nameFile,
      mimeType: file?.mimetype,
      folder: 'galleries',
      file: file.buffer,
    });
    const extension = mime.extension(file.mimetype);
    const fileName = `${nameFile}.${extension}`;

    await this.galleriesService.createOne({
      title,
      whoCanSee,
      description,
      allowDownload: Boolean(allowDownload),
      userId: user?.id,
      path: fileName,
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

    const findOneGallery = await this.galleriesService.findOneBy({
      galleryId,
    });
    if (!findOneGallery)
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
        allowDownload: Boolean(allowDownload),
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

  /** Get on file gallery */
  @Get(`/file/:fileName`)
  // @UseGuards(JwtAuthGuard)
  async getOneFileGallery(@Res() res, @Param('fileName') fileName: string) {
    try {
      const { fileBuffer, contentType } = await getFileToAws({
        folder: 'galleries',
        fileName,
      });
      res.status(200);
      res.contentType(contentType);
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.send(fileBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération de l'image.");
    }
  }
}
