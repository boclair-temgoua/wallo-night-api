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
import { isEmpty } from '../../app/utils/commons/is-empty';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /** Get all Comments */
  @Get(`/`)
  async findAllComments(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: CommentsDto,
  ) {
    const { postId, productId, userVisitorId, modelIds } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const comments = await this.commentsService.findAll({
      search,
      postId,
      productId,
      pagination,
      likeUserId: userVisitorId,
      modelIds: modelIds ? (String(modelIds).split(',') as []) : null,
    });

    return reply({ res, results: comments });
  }

  @Get(`/replies`)
  async findAllCommentsReplies(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: CommentsDto,
  ) {
    const { commentId, userVisitorId, modelIds } = query;
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
      likeUserId: userVisitorId,
      parentId: findOneComment?.id,
      modelIds: modelIds ? (String(modelIds).split(',') as []) : null,
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
    const { description, postId, productId, organizationId, model } = body;

    const comment = await this.commentsService.createOne({
      postId: isEmpty(postId) ? null : postId,
      productId: isEmpty(productId) ? null : productId,
      description,
      model,
      organizationId: organizationId,
      userId: user?.id,
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
    const { description, model } = body;

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
      model,
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
