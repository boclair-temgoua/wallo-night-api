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
import { UserAuthGuard } from '../users/middleware';
import { CommentsDto, CreateOrUpdateCommentsDto } from './comments.dto';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { PostsService } from '../posts/posts.service';
import { Cookies } from '../users/middleware/cookie.guard';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  /** Get all Comments */
  @Get(`/`)
  async findAllComments(
    @Res() res,
    @Req() req,
    @Cookies('x-cookies-login') user: any,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: CommentsDto,
  ) {
    const { postId } = query;
    const { search } = searchQuery;

    if (postId) {
      const findOnePost = await this.postsService.findOneBy({
        postId,
      });
      if (!findOnePost)
        throw new HttpException(
          `This post ${postId} dons't exist please change`,
          HttpStatus.NOT_FOUND,
        );
    }

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const comments = await this.commentsService.findAll({
      search,
      pagination,
      postId,
      likeUserId: user?.id,
    });

    return reply({ res, results: comments });
  }

  @Get(`/replies`)
  async findAllCommentsReplies(
    @Res() res,
    @Req() req,
    @Cookies('x-cookies-login') user: any,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: CommentsDto,
  ) {
    const { commentId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const findOneComment = await this.commentsService.findOneBy({
      commentId,
    });
    if (!findOneComment)
      throw new HttpException(
        `This comment ${commentId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const comments = await this.commentsService.findAll({
      search,
      pagination,
      likeUserId: user?.id,
      parentId: findOneComment?.id,
    });

    return reply({ res, results: comments });
  }

  /** Create Comment */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  async createOneComment(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCommentsDto,
  ) {
    const { user } = req;
    const { description, postId } = body;

    if (postId) {
      const findOnePost = await this.postsService.findOneBy({
        postId,
      });
      if (!findOnePost)
        throw new HttpException(
          `This post ${postId} dons't exist please change`,
          HttpStatus.NOT_FOUND,
        );
    }

    const comment = await this.commentsService.createOne({
      postId,
      userId: user?.id,
      description,
    });

    return reply({ res, results: comment });
  }

  /** Create reply Comment */
  @Post(`/replies`)
  @UseGuards(UserAuthGuard)
  async createOneCommentReplies(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCommentsDto,
    @Body('parentId', ParseUUIDPipe) parentId: string,
  ) {
    const { user } = req;
    const { description } = body;

    const findOneComment = await this.commentsService.findOneBy({
      commentId: parentId,
    });
    if (!findOneComment)
      throw new HttpException(
        `This comment ${parentId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.commentsService.createOne({
      postId: findOneComment?.postId,
      parentId: parentId,
      userId: user?.id,
      description,
    });

    return reply({ res, results: { id: parentId } });
  }

  /** Update Comment */
  @Put(`/:commentId`)
  @UseGuards(UserAuthGuard)
  async updateOneComment(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCommentsDto,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    const { description } = body;

    const findOneComment = await this.commentsService.findOneBy({
      commentId,
    });
    if (!findOneComment)
      throw new HttpException(
        `This comment ${commentId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const comment = await this.commentsService.updateOne(
      { commentId: findOneComment?.id },
      { description },
    );

    return reply({ res, results: comment });
  }

  /** Delete Comment */
  @Delete(`/:commentId`)
  @UseGuards(UserAuthGuard)
  async deleteOneComment(
    @Res() res,
    @Req() req,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    const { user } = req;
    const findOneComment = await this.commentsService.findOneBy({
      commentId,
      userId: user?.id,
    });
    if (!findOneComment)
      throw new HttpException(
        `This comment ${commentId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.commentsService.updateOne(
      { commentId: findOneComment?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: { id: commentId } });
  }
}
