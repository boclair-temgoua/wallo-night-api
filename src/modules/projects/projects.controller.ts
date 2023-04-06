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
  Delete,
  Put,
} from '@nestjs/common';
import {
  addPagination,
  PaginationType,
  RequestPaginationDto,
} from '../../app/utils/pagination';
import { FilterQueryType, SearchQueryDto } from '../../app/utils/search-query';
import { reply } from '../../app/utils/reply';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../users/middleware';
import { Project } from '../../models/Project';
import { CreateOrUpdateProjectsDto } from './projects.dto';
import { ContributorsService } from '../contributors/contributors.service';
import {
  ContributorRole,
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
      option1: {
        userId: user?.id,
        type: FilterQueryType.PROJECT,
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
  async createOneProject(
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
      type: FilterQueryType.PROJECT,
    });

    return reply({ res, results: project });
  }

  /** Update Project */
  @Put(`/:projectId`)
  @UseGuards(JwtAuthGuard)
  async updateOneProject(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProjectsDto,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const { user } = req;
    const { name, description } = body;

    const findOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });
    if (!findOneProject)
      throw new HttpException(
        `Project ${projectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.projectsService.updateOne(
      { option1: { projectId: findOneProject?.id } },
      { name, description },
    );

    return reply({ res, results: 'Project updated successfully' });
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

    const findOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });

    const getOneContributor = await this.contributorsService.findOneBy({
      option4: {
        userId: user?.id,
        projectId: findOneProject?.id,
        organizationId: findOneProject?.organizationId,
        type: FilterQueryType.PROJECT,
      },
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this project ${projectId} please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({
      res,
      results: { ...findOneProject, role: getOneContributor?.role },
    });
  }

  /** Delete Project */
  @Delete(`/:projectId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneProject(
    @Res() res,
    @Req() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const { user } = req;

    const findOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });
    if (!findOneProject)
      throw new HttpException(
        `Project ${projectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findAllContributors =
      await this.contributorsService.findAllNotPaginate({
        option3: {
          type: FilterQueryType.PROJECT,
          projectId: findOneProject?.id,
          organizationId: findOneProject?.organizationId,
        },
      });

    Promise.all([
      findAllContributors.map(async (item) => {
        await this.contributorsService.updateOne(
          { option1: { contributorId: item?.id } },
          { deletedAt: new Date() },
        );
      }),
    ]);

    await this.projectsService.updateOne(
      { option1: { projectId: findOneProject?.id } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Project deleted successfully' });
  }
}
