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
  CreateOrUpdatePostsGalleriesDto,
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
import { FollowsService } from '../follows/follows.service';
import { Cookies } from '../users/middleware/cookie.guard';
import { UploadsUtil } from '../uploads/uploads.util';
import { isNotUndefined } from '../../app/utils/commons/generate-random';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly uploadsUtil: UploadsUtil,
    private readonly postsService: PostsService,
    private readonly followsService: FollowsService,
  ) {}

  /** Get all Posts */
  @Get(`/follows`)
  @UseGuards(JwtAuthGuard)
  async findAllFollow(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    let userFollows: string[] = [];
    const followings = await this.followsService.findAllNotPaginate({
      userId: user?.id,
    });

    for (const element of followings) {
      userFollows.push(element.followerId);
    }

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const posts = await this.postsService.findAll({
      search,
      pagination,
      likeUserId: user?.id,
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
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Cookies('x-cookies-login') user: any,
  ) {
    const { type, userId, typeIds, status } = query;
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
      typeIds: typeIds ? (String(typeIds).split(',') as []) : null,
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

  /** Post one Galleries */
  @Post(`/galleries`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOneGallery(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsGalleriesDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { user } = req;
    const { title, whoCanSee, allowDownload, membershipId, description, type } =
      body;

    const post = await this.postsService.createOne({
      type,
      title,
      whoCanSee,
      description,
      userId: user?.id,
      membershipId: isNotUndefined(membershipId) ? membershipId : null,
      allowDownload: allowDownload === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'POST',
      uploadableId: post?.id,
      userId: post?.userId,
      folder: 'posts',
      files,
    });

    return reply({ res, results: 'Gallery created successfully' });
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
    const {
      title,
      status,
      description,
      membershipId,
      enableUrlMedia,
      urlMedia,
      type,
    } = body;

    const post = await this.postsService.createOne({
      type,
      title,
      status,
      urlMedia,
      userId: user?.id,
      description,
      membershipId: isNotUndefined(membershipId) ? membershipId : null,
      enableUrlMedia: enableUrlMedia === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'POST',
      uploadableId: post?.id,
      userId: post?.userId,
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
      status,
      description,
      allowDownload,
      urlMedia,
      whoCanSee,
      membershipId,
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
        status,
        whoCanSee,
        urlMedia,
        description,
        membershipId: isNotUndefined(membershipId) ? membershipId : null,
        allowDownload: allowDownload === 'true' ? true : false,
        enableUrlMedia: enableUrlMedia === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'POST',
      uploadableId: postId,
      userId: findOnePost?.userId,
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

  /** Create Image AWS */
  // @Post(`/upload`)
  // @UseInterceptors(FileInterceptor('image'))
  // async createOneFileAws(
  //   @Res() res,
  //   @Req() req,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   const nameFile = `${formateNowDateYYMMDD(new Date())}${generateLongUUID(
  //     8,
  //   )}`;
  //   const response = await awsS3ServiceAdapter({
  //     name: nameFile,
  //     mimeType: file?.mimetype,
  //     folder: 'posts',
  //     file: file.buffer,
  //   });

  //   console.log('response =======>', response);

  //   return reply({ res, results: { urlFile: response.Location } });
  // }

  /** Get on file gallery */
  // @Get(`/gallery/:fileName`)
  // async getOneFilePostGallery(@Res() res, @Param('fileName') fileName: string) {
  //   try {
  //     const { fileBuffer, contentType } = await getFileToAws({
  //       folder: 'posts',
  //       fileName,
  //     });
  //     res.status(200);
  //     res.contentType(contentType);
  //     res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  //     res.send(fileBuffer);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Erreur lors de la récupération de l'image.");
  //   }
  // }
}
