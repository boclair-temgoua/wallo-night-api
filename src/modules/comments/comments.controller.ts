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
import { DocumentsService } from '../documents/documents.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly documentsService: DocumentsService,
    private readonly postsService: PostsService,
  ) {}

  /** Get all Comments */
  @Get(`/`)
  async findAllComments(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: CommentsDto,
  ) {
    const { documentId, postId } = query;
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

    if (documentId) {
      const findOneDocument = await this.documentsService.findOneBy({
        option1: { documentId },
      });
      if (!findOneDocument)
        throw new HttpException(
          `This post ${documentId} dons't exist please change`,
          HttpStatus.NOT_FOUND,
        );
    }

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const comments = await this.commentsService.findAll({
      search,
      pagination,
      postId,
      documentId,
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
    const { description, documentId, postId } = body;

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

    if (documentId) {
      const findOneDocument = await this.documentsService.findOneBy({
        option1: { documentId },
      });
      if (!findOneDocument)
        throw new HttpException(
          `This post ${documentId} dons't exist please change`,
          HttpStatus.NOT_FOUND,
        );
    }

    const comment = await this.commentsService.createOne({
      postId,
      documentId,
      userId: user?.id,
      description,
    });

    return reply({ res, results: comment });
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

    return reply({ res, results: `comment deleted successfully` });
  }
}
