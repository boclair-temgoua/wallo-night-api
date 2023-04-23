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
import { CreateOrUpdateGroupsDto, GroupsDto } from './groups.dto';
import { JwtAuthGuard } from '../users/middleware';

import { GroupsService } from './groups.service';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  /** Get all Groups */
  @Get(`/`)
  async findAllGroups(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: GroupsDto,
  ) {
    const {
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
    } = query;

    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const groups = await this.groupsService.findAll({
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
      search,
      pagination,
    });

    return reply({ res, results: groups });
  }

  /** Get one Group */
  @Get(`/show/:groupId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDGroup(
    @Res() res,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ) {
    const group = await this.groupsService.findOneBy({ option1: { groupId } });

    return reply({ res, results: group });
  }

  /** Create Group */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneGroup(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateGroupsDto,
  ) {
    const { user } = req;
    const {
      name,
      description,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
    } = body;

    const group = await this.groupsService.createOne({
      name,
      description,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
      userCreatedId: user?.id,
    });

    return reply({ res, results: group });
  }

  /** Update Group */
  @Put(`/:groupId`)
  @UseGuards(JwtAuthGuard)
  async updateOneGroup(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateGroupsDto,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ) {
    const { name, description } = body;

    const findOneGroup = await this.groupsService.findOneBy({
      option1: { groupId },
    });
    if (!findOneGroup)
      throw new HttpException(
        `This Group ${groupId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const group = await this.groupsService.updateOne(
      { option1: { groupId: findOneGroup?.id } },
      { name, description },
    );

    return reply({ res, results: group });
  }

  /** Get One Group */
  @Get(`/show/:groupId`)
  @UseGuards(JwtAuthGuard)
  async getOneById(
    @Res() res,
    @Req() req,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ) {
    const findOneGroup = await this.groupsService.findOneBy({
      option1: { groupId },
    });
    if (!findOneGroup)
      throw new HttpException(
        `This group ${groupId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneGroup });
  }

  /** Delete Group */
  @Delete(`/:groupId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneGroup(
    @Res() res,
    @Req() req,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ) {
    const findOneGroup = await this.groupsService.findOneBy({
      option1: { groupId },
    });
    if (!findOneGroup)
      throw new HttpException(
        `This Group ${groupId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const group = await this.groupsService.updateOne(
      { option1: { groupId: findOneGroup?.id } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: group });
  }
}
