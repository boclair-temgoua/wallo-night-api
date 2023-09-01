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
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { useCatch } from '../../app/utils/use-catch';
import { CommentsDto, CreateOrUpdateCommentsDto } from './comments.dto';
import { JwtAuthGuard } from '../users/middleware';

import { CommentsService } from './comments.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { PostsService } from '../posts/posts.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  /** Get all Comments */
  @Get(`/`)
  // @UseGuards(JwtAuthGuard)
  async findAllComments(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: CommentsDto,
  ) {
    const { user } = req;
    const { postId, userId } = query;
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
      userId: userId,
    });

    return reply({ res, results: comments });
  }

  @Get(`/replies`)
  // @UseGuards(JwtAuthGuard)
  async findAllCommentsReplies(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: CommentsDto,
  ) {
    const { commentId, userId } = query;
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
      userId: userId,
      parentId: findOneComment?.id,
    });

    return reply({ res, results: comments });
  }

  /** Create Comment */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
