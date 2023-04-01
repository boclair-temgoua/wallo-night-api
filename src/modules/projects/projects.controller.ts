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
import { SearchQueryDto } from '../../app/utils/search-query';
import { reply } from '../../app/utils/reply';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../users/middleware';
import { Project } from '../../models/Project';
import { CreateOrUpdateProjectsDto } from './projects.dto';
import { ContributorsService } from '../contributors/contributors.service';
import {
  ContributorRole,
  ContributorType,
} from '../contributors/contributors.type';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly contributorsService: ContributorsService,
  ) {}

  @Get(`/contributes`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    /** get contributor filter by Project */
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const projects = await this.contributorsService.findAll({
      option2: {
        userId: user?.id,
        type: ContributorType.PROJECT,
      },
      search,
      pagination,
    });

    return reply({ res, results: projects });
  }

  /** Get Projects */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllProjectsBy(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const projects = await this.projectsService.findAll({
      option1: { organizationId: user?.organizationInUtilizationId },
      search,
      pagination,
    });

    return reply({ res, results: projects });
  }

  /** Create Project */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneFaq(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProjectsDto,
  ) {
    const { user } = req;
    const { name, description } = body;

    const project = await this.projectsService.createOne({
      name,
      description,
      organizationId: user?.organizationInUtilizationId,
      userCreatedId: user?.id,
    });

    await this.contributorsService.createOne({
      userId: user?.id,
      projectId: project?.id,
      userCreatedId: user?.id,
      role: ContributorRole.ADMIN,
      organizationId: user?.organizationInUtilizationId,
      type: ContributorType.PROJECT,
    });

    return reply({ res, results: project });
  }

  /** Create Project */
  @Get(`/:projectId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDProject(
    @Res() res,
    @Req() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const { user } = req;

    const getOneContributor = await this.contributorsService.findOneBy({
      option4: {
        userId: user?.id,
        projectId,
        organizationId: user?.organizationInUtilizationId,
        type: ContributorType.PROJECT,
      },
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this project ${projectId} please change`,
        HttpStatus.NOT_FOUND,
      );

    const project = await this.projectsService.findOneBy({
      option1: { projectId },
    });

    return reply({ res, results: project });
  }
}
