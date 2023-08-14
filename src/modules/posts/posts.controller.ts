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
import { CreateOrUpdatePostsDto } from './posts.dto';
import { JwtAuthGuard } from '../users/middleware';

import { PostsService } from './posts.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import {
  awsS3ServiceAdapter,
  getFileToAws,
} from '../integrations/aws/aws-s3-service-adapter';
import {
  formateNowDateYYMMDD,
  generateLongUUID,
} from '../../app/utils/commons';
import * as mime from 'mime-types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /** Get all Posts */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const Posts = await this.postsService.findAll({ search, pagination });

    return reply({ res, results: Posts });
  }

  /** Get one Post */
  @Get(`/show/:postId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const post = await this.postsService.findOneBy({ postId });

    return reply({ res, results: post });
  }

  /** Create Posts */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const { title, status, description } = body;
    const attachment = req.file;
    let fileName;

    if (attachment) {
      const nameFile = `${formateNowDateYYMMDD(new Date())}${generateLongUUID(
        8,
      )}`;
      await awsS3ServiceAdapter({
        name: nameFile,
        mimeType: file?.mimetype,
        folder: 'posts',
        file: file.buffer,
      });
      const extension = mime.extension(file.mimetype);
      fileName = `${nameFile}.${extension}`;
    }

    await this.postsService.createOne({
      title,
      status,
      userId: user?.id,
      description,
      image: fileName,
    });

    return reply({ res, results: 'post save successfully' });
  }

  /** Update Post */
  @Put(`/:postId`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const { title, status, description } = body;
    const attachment = req.file;
    let fileName;

    if (attachment) {
      const nameFile = `${formateNowDateYYMMDD(new Date())}${generateLongUUID(
        8,
      )}`;
      await awsS3ServiceAdapter({
        name: nameFile,
        mimeType: file?.mimetype,
        folder: 'posts',
        file: file.buffer,
      });
      const extension = mime.extension(file.mimetype);
      fileName = `${nameFile}.${extension}`;
    }

    const findOnePost = await this.postsService.findOneBy({ postId });
    if (!findOnePost)
      throw new HttpException(
        `This post ${postId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.postsService.updateOne(
      { postId },
      { title, status, description, image: fileName },
    );

    return reply({ res, results: 'post updated successfully' });
  }

  /** Delete postId */
  @Delete(`/:postId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const findOnePost = await this.postsService.findOneBy({ postId });
    if (!findOnePost)
      throw new HttpException(
        `This post ${findOnePost} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const post = await this.postsService.updateOne(
      { postId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: post });
  }

  /** Create Image AWS */
  @Post(`/upload`)
  @UseInterceptors(FileInterceptor('image'))
  async createOneFileAws(
    @Res() res,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const nameFile = `${formateNowDateYYMMDD(new Date())}${generateLongUUID(
      8,
    )}`;
    const response = await awsS3ServiceAdapter({
      name: nameFile,
      mimeType: file?.mimetype,
      folder: 'posts',
      file: file.buffer,
    });

    console.log('response =======>', response);

    return reply({ res, results: { urlFile: response.Location } });
  }

  /** Get on file post */
  @Get(`/file/:fileName`)
  // @UseGuards(JwtAuthGuard)
  async getOneFileGallery(@Res() res, @Param('fileName') fileName: string) {
    try {
      const { fileBuffer, contentType } = await getFileToAws({
        folder: 'posts',
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
