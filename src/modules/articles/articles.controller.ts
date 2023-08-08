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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { reply } from '../../app/utils/reply';
import { CreateOrUpdateArticlesDto } from './articles.dto';
import { JwtAuthGuard } from '../users/middleware';

import { ArticlesService } from './articles.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import {
  formateNowDateYYMMDD,
  generateLongUUID,
} from '../../app/utils/commons';
import * as mime from 'mime-types';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /** Get all Articles */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const articles = await this.articlesService.findAll({ search, pagination });

    return reply({ res, results: articles });
  }

  /** Get one Article */
  @Get(`/show/:articleId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ) {
    const article = await this.articlesService.findOneBy({ articleId });

    return reply({ res, results: article });
  }

  /** Create Article */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateArticlesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const { title, status, description } = body;

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

    const article = await this.articlesService.createOne({
      title,
      status,
      userId: user?.id,
      description,
      // image: fileName,
    });

    return reply({ res, results: article });
  }

  /** Update Article */
  @Put(`/:articleId`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateArticlesDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ) {
    const { title, status, description } = body;

    const findOneArticle = await this.articlesService.findOneBy({ articleId });
    if (!findOneArticle)
      throw new HttpException(
        `This article ${articleId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const article = await this.articlesService.updateOne(
      { articleId },
      { title, status, description },
    );

    return reply({ res, results: article });
  }

  /** Delete Article */
  @Delete(`/:articleId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('articleId', ParseUUIDPipe) articleId: string,
  ) {
    const findOneArticle = await this.articlesService.findOneBy({ articleId });
    if (!findOneArticle)
      throw new HttpException(
        `This article ${articleId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const article = await this.articlesService.updateOne(
      { articleId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: article });
  }
}
