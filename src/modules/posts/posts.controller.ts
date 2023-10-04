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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { reply } from '../../app/utils/reply';
import {
  CreateOrUpdatePostsDto,
  GetGalleriesDto,
  GetOnePostDto,
} from './posts.dto';
import { JwtAuthGuard } from '../users/middleware';

import { PostsService } from './posts.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { Cookies } from '../users/middleware/cookie.guard';
import { UploadsUtil } from '../uploads/uploads.util';
import { isNotUndefined } from '../../app/utils/commons/generate-random';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly uploadsUtil: UploadsUtil,
    private readonly postsService: PostsService,
  ) {}

  /** Get all Posts */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetGalleriesDto,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Cookies('x-cookies-login') user: any,
  ) {
    const { type, userId, status } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const posts = await this.postsService.findAll({
      search,
      pagination,
      type,
      userId,
      status: status?.toUpperCase(),
      likeUserId: user?.id,
    });

    return reply({ res, results: posts });
  }

  /** Get one Posts */
  @Get(`/view`)
  async getOne(
    @Res() res,
    @Req() req,
    @Query() query: GetOnePostDto,
    @Cookies('x-cookies-login') user: any,
  ) {
    const { postId, userId, type, postSlug } = query;

    const findOnePost = await this.postsService.findOneBy({
      postId,
      postSlug,
      userId,
      likeUserId: user?.id,
      type: type?.toUpperCase(),
    });
    if (!findOnePost)
      throw new HttpException(
        `Post ${postId} ${postSlug} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOnePost });
  }

  /** Create Posts */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { user } = req;
    const { title, description, enableUrlMedia, urlMedia, type } = body;

    const post = await this.postsService.createOne({
      type,
      title,
      urlMedia,
      userId: user?.id,
      description,
      enableUrlMedia: enableUrlMedia === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'POST',
      uploadableId: post?.id,
      organizationId: post?.organizationId,
      folder: 'posts',
      files,
    });

    return reply({ res, results: 'post save successfully' });
  }

  /** Update Post */
  @Put(`/:postId`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const {
      title,
      description,
      allowDownload,
      urlMedia,
      whoCanSee,
      enableUrlMedia,
    } = body;

    const findOnePost = await this.postsService.findOneBy({ postId });
    if (!findOnePost)
      throw new HttpException(
        `This post ${postId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.postsService.updateOne(
      { postId },
      {
        title,
        whoCanSee,
        urlMedia,
        description,
        allowDownload: allowDownload === 'true' ? true : false,
        enableUrlMedia: enableUrlMedia === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'POST',
      uploadableId: postId,
      organizationId: findOnePost?.organizationId,
      folder: 'posts',
      files,
    });

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
}
