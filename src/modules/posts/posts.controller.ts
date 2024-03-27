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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { reply } from '../../app/utils/reply';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateOrUpdatePostsDto,
  CreateOrUpdatePostsGalleriesDto,
  GetGalleriesDto,
  GetOnePostDto,
  GetPostsDto,
} from './posts.dto';

import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { FollowsService } from '../follows/follows.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly uploadsUtil: UploadsUtil,
    private readonly postsService: PostsService,
    private readonly followsService: FollowsService,
  ) {}

  /** Get all Posts */
  @Get(`/follows`)
  @UseGuards(UserAuthGuard)
  async findAllFollow(
    @Res() res,
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: GetPostsDto,
  ) {
    const { user } = req;
    const { model } = query;
    const { search } = searchQuery;

    let userFollows: string[] = [];
    const followings = await this.followsService.findAllNotPaginate({
      userId: user?.id,
    });

    for (const element of followings) {
      userFollows.push(element.followerId);
    }

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const posts = await this.postsService.findAll({
      search,
      pagination,
      likeUserId: user?.id,
      model,
      followerIds: [...userFollows, user?.id],
    });

    return reply({ res, results: posts });
  }

  /** Get all Posts */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetGalleriesDto,
    @Query() PaginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const {
      type,
      model,
      albumId,
      organizationId,
      typeIds,
      status,
      userVisitorId,
    } = query;
    const { search } = searchQuery;

    const { take, page, sort } = PaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const posts = await this.postsService.findAll({
      search,
      pagination,
      type,
      model,
      albumId,
      organizationId,
      status: status?.toUpperCase(),
      likeUserId: userVisitorId,
      typeIds: typeIds ? (String(typeIds).split(',') as []) : null,
    });

    return reply({ res, results: posts });
  }

  /** Get one Posts */
  @Get(`/view`)
  async getOne(@Res() res, @Req() req, @Query() query: GetOnePostDto) {
    const { postId, organizationId, type, postSlug, userVisitorId } = query;

    const findOnePost = await this.postsService.findOneBy({
      postId,
      postSlug,
      organizationId,
      likeUserId: userVisitorId,
      type: type?.toUpperCase(),
    });
    if (!findOnePost)
      throw new HttpException(
        `Post ${postId} ${postSlug} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOnePost });
  }

  /** Post one Galleries */
  @Post(`/galleries`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOneGallery(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsGalleriesDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { user } = req;
    const {
      title,
      categoryId,
      whoCanSee,
      allowDownload,
      description,
      albumId,
      type,
    } = body;

    const post = await this.postsService.createOne({
      type,
      title,
      whoCanSee,
      categoryId,
      description,
      userId: user?.id,
      albumId: albumId,
      organizationId: user?.organizationId,
      allowDownload: allowDownload === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'POST',
      postId: post?.id,
      uploadableId: post?.id,
      userId: post?.userId,
      organizationId: post?.organizationId,
      folder: 'posts',
      files,
    });

    return reply({ res, results: 'Gallery created successfully' });
  }

  /** Create Posts */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { user } = req;
    const {
      title,
      status,
      categoryId,
      description,
      allowDownload,
      urlMedia,
      whoCanSee,
      enableUrlMedia,
      type,
      albumId,
    } = body;

    const post = await this.postsService.createOne({
      type,
      title,
      status,
      urlMedia,
      whoCanSee,
      categoryId,
      description,
      albumId,
      userId: user?.id,
      organizationId: user?.organizationId,
      allowDownload: allowDownload === 'true' ? true : false,
      enableUrlMedia: enableUrlMedia === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'POST',
      postId: post?.id,
      uploadableId: post?.id,
      userId: post?.userId,
      folder: 'posts',
      files,
      organizationId: post?.organizationId,
    });

    return reply({ res, results: 'post save successfully' });
  }

  /** Update Post */
  @Put(`/:postId`)
  @UseGuards(UserAuthGuard)
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
      status,
      categoryId,
      description,
      allowDownload,
      urlMedia,
      whoCanSee,
      enableUrlMedia,
    } = body;
    const { user } = req;

    const findOnePost = await this.postsService.findOneBy({
      postId,
      organizationId: user?.organizationId,
    });
    if (!findOnePost)
      throw new HttpException(
        `This post ${postId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.postsService.updateOne(
      { postId },
      {
        title,
        status,
        urlMedia,
        whoCanSee,
        categoryId,
        description,
        allowDownload: allowDownload === 'true' ? true : false,
        enableUrlMedia: enableUrlMedia === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'POST',
      postId: postId,
      uploadableId: postId,
      userId: findOnePost?.userId,
      folder: 'posts',
      files,
      organizationId: findOnePost?.organizationId,
    });

    return reply({ res, results: 'post updated successfully' });
  }

  /** Delete postId */
  @Delete(`/:postId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const { user } = req;
    const findOnePost = await this.postsService.findOneBy({
      postId,
      organizationId: user?.organizationId,
    });
    if (!findOnePost)
      throw new HttpException(
        `This post ${postId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const post = await this.postsService.updateOne(
      { postId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: post });
  }
}
