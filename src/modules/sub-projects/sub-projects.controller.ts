import {
  Controller,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Res,
  Get,
  Req,
  Query,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  addPagination,
  PaginationType,
  RequestPaginationDto,
} from '../../app/utils/pagination';
import { FilterQueryType, SearchQueryDto } from '../../app/utils/search-query';
import { reply } from '../../app/utils/reply';
import { SubProjectsService } from './sub-projects.service';
import { JwtAuthGuard } from '../users/middleware';
import { SubProject } from '../../models/SubProject';
import { CreateOrUpdateSubProjectsDto } from './sub-projects.dto';
import { ContributorsService } from '../contributors/contributors.service';
import { ContributorRole } from '../contributors/contributors.type';
import { ProjectsService } from '../projects/projects.service';

@Controller('sub-projects')
export class SubProjectsController {
  constructor(
    private readonly subProjectsService: SubProjectsService,
    private readonly projectsService: ProjectsService,
    private readonly contributorsService: ContributorsService,
  ) {}

  @Get(`/contributes`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query('projectId', ParseUUIDPipe) projectId: string,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    /** get contributor filter by SubProject */
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const getOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });

    if (!getOneProject)
      throw new HttpException(
        `Project ${projectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const subProjects = await this.contributorsService.findAll({
      search,
      pagination,
      userId: user?.id,
      projectId: getOneProject?.id,
      organizationId: getOneProject?.organizationId,
      type: FilterQueryType.SUBPROJECT,
    });

    return reply({ res, results: subProjects });
  }

  /** Get SubProjects */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllSubProjectsBy(
    @Res() res,
    @Req() req,
    @Query('projectId', ParseUUIDPipe) projectId: string,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const getOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });

    if (!getOneProject)
      throw new HttpException(
        `Project ${projectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const subProjects = await this.subProjectsService.findAll({
      option1: {
        organizationId: getOneProject?.organizationId,
        projectId: getOneProject?.id,
      },
      search,
      pagination,
    });

    return reply({ res, results: subProjects });
  }

  /** Create Sub SubProject */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneSubProject(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateSubProjectsDto,
  ) {
    const { user } = req;
    const { name, description, projectId } = body;

    const getOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });

    if (!getOneProject)
      throw new HttpException(
        `Project ${projectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const subProject = await this.subProjectsService.createOne({
      name,
      description,
      projectId: getOneProject?.id,
      organizationId: user?.organizationInUtilizationId,
      userCreatedId: user?.id,
    });

    await this.contributorsService.createOne({
      userId: user?.id,
      subProjectId: subProject?.id,
      userCreatedId: user?.id,
      projectId: getOneProject?.id,
      role: ContributorRole.ADMIN,
      organizationId: user?.organizationInUtilizationId,
      type: FilterQueryType.SUBPROJECT,
    });

    return reply({ res, results: subProject });
  }

  /** Create SubProject */
  @Get(`/:subProjectId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDSubProject(
    @Res() res,
    @Req() req,
    @Param('subProjectId', ParseUUIDPipe) subProjectId: string,
  ) {
    const { user } = req;

    const subProject = await this.subProjectsService.findOneBy({
      option1: { subProjectId },
    });

    const getOneContributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      projectId: subProject?.projectId,
      subProjectId,
      organizationId: user?.organizationInUtilizationId,
      type: FilterQueryType.SUBPROJECT,
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this sub project ${subProjectId} please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: subProject });
  }
}
