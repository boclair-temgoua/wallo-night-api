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
import { PostsDto, CreateOrUpdatePostsDto } from './posts.dto';
import { JwtAuthGuard } from '../users/middleware';

import { PostsService } from './posts.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { GroupsService } from '../groups/groups.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly groupsService: GroupsService,
  ) {}

  /** Get all Posts */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllPosts(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: PostsDto,
  ) {
    const { user } = req;
    const { groupId } = query;
    const { search } = searchQuery;

    if (groupId) {
      const findOneGroup = await this.groupsService.findOneBy({
        groupId,
      });
      if (!findOneGroup)
        throw new HttpException(
          `This group ${groupId} dons't exist please change`,
          HttpStatus.NOT_FOUND,
        );
    }

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const posts = await this.postsService.findAll({
      search,
      pagination,
      groupId,
      userId: user?.id,
    });

    return reply({ res, results: posts });
  }

  /** Create Post */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOnePost(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsDto,
  ) {
    const { user } = req;
    const { title, description, groupId } = body;

    if (groupId) {
      const findOneGroup = await this.groupsService.findOneBy({
        groupId,
      });
      if (!findOneGroup)
        throw new HttpException(
          `This group ${groupId} dons't exist please change`,
          HttpStatus.NOT_FOUND,
        );
    }
    const post = await this.postsService.createOne({
      title,
      groupId,
      userId: user?.id,
      description,
    });

    return reply({ res, results: post });
  }

  /** Update Post */
  @Put(`/:postId`)
  @UseGuards(JwtAuthGuard)
  async updateOnePost(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdatePostsDto,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const { title, description } = body;

    const findOnePost = await this.postsService.findOneBy({
      postId,
    });
    if (!findOnePost)
      throw new HttpException(
        `This post ${postId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const Post = await this.postsService.updateOne(
      { postId: findOnePost?.id },
      { title, description },
    );

    return reply({ res, results: Post });
  }

  /** Get Post */
  @Get(`/show`)
  @UseGuards(JwtAuthGuard)
  async getOnePost(
    @Res() res,
    @Req() req,
    @Query('postSlug') postSlug: string,
  ) {
    const findOnePost = await this.postsService.findOneBy({
      slug: postSlug,
    });
    if (!findOnePost)
      throw new HttpException(
        `This post ${postSlug} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOnePost });
  }

  /** Delete Post */
  @Delete(`/:postId`)
  @UseGuards(JwtAuthGuard)
  async deleteOnePost(
    @Res() res,
    @Req() req,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    const findOnePost = await this.postsService.findOneBy({
      postId,
    });
    if (!findOnePost)
      throw new HttpException(
        `This post ${postId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const post = await this.postsService.updateOne(
      { postId: findOnePost?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: post });
  }
}
