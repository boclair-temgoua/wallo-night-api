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
  ConsoleLogger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import {
  awsS3ServiceAdapter,
  getFileToAws,
} from '../integrations/aws/aws-s3-service-adapter';
import {
  formateNowDateYYMMDD,
  generateLongUUID,
} from '../../app/utils/commons';
import * as mime from 'mime-types';
import { CategoriesService } from '../categories/categories.service';
import { PostCategoriesService } from '../post-categories/post-categories.service';
import { FollowsService } from '../follows/follows.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly followsService: FollowsService,
    private readonly postCategoriesService: PostCategoriesService,
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

    followings.forEach((element) => {
      userFollows.push(element?.followerId);
    });

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const posts = await this.postsService.findAll({
      search,
      pagination,
      userId: user?.id,
      likeUserId: user?.id,
      followerIds: [...userFollows, user?.id],
    });

    return reply({ res, results: posts });
  }

  /** Get all Posts */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() query: GetGalleriesDto,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { type, userId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const posts = await this.postsService.findAll({
      search,
      pagination,
      type,
      userId,
    });

    return reply({ res, results: posts });
  }

  /** Get one Posts */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOnePostDto) {
    const { postId, userId, likeUserId, type, postSlug } = query;

    const findOnePost = await this.postsService.findOneBy({
      postId,
      postSlug,
      userId,
      likeUserId,
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
  @UseInterceptors(FileInterceptor('attachment'))
  async createOneGallery(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsGalleriesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { user } = req;
    const { title, whoCanSee, allowDownload, description, type } = body;

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
    const fileName = `${nameFile}.${extension}`;

    await this.postsService.createOne({
      type,
      title,
      whoCanSee,
      description,
      userId: user?.id,
      image: fileName,
      allowDownload: allowDownload === 'true' ? true : false,
    });

    return reply({ res, results: 'Gallery created successfully' });
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
    const { title, status, description, categories, urlMedia, type } = body;
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

    const savePost = await this.postsService.createOne({
      type,
      title,
      status,
      urlMedia,
      userId: user?.id,
      description,
      image: fileName,
    });

    if (categories) {
      Promise.all([
        String(categories)
          .split(',')
          .forEach(async (categoryId) => {
            await this.postCategoriesService.createOne({
              postId: savePost?.id,
              categoryId,
            });
          }),
      ]);
    }

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
    const {
      title,
      status,
      description,
      allowDownload,
      urlMedia,
      whoCanSee,
      categories,
    } = body;
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
      {
        title,
        status,
        whoCanSee,
        urlMedia,
        description,
        image: fileName,
        allowDownload: allowDownload === 'true' ? true : false,
      },
    );

    // if (categories) {
    //   Promise.all([
    //     String(categories)
    //       .split(',')
    //       .forEach(async (categoryId) => {
    //         await this.postCategoriesService.createOne({
    //           postId: findOnePost?.id,
    //           categoryId,
    //         });
    //       }),
    //   ]);
    // }

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

  /** Get on file gallery */
  @Get(`/gallery/:fileName`)
  // @UseGuards(JwtAuthGuard)
  async getOneFilePostGallery(@Res() res, @Param('fileName') fileName: string) {
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
