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
import {
  FilterQueryType,
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query';
import { reply } from '../../app/utils/reply';
import { SubSubProjectsService } from './sub-sub-projects.service';
import { JwtAuthGuard } from '../users/middleware';
import {
  UpdateSubSubProjectsDto,
  CreateSubSubProjectsDto,
} from './sub-sub-projects.dto';
import { ContributorsService } from '../contributors/contributors.service';
import { ContributorRole } from '../contributors/contributors.type';
import { SubProjectsService } from '../sub-projects/sub-projects.service';

@Controller('sub-sub-projects')
export class SubSubProjectsController {
  constructor(
    private readonly subSubProjectsService: SubSubProjectsService,
    private readonly subProjectsService: SubProjectsService,
    private readonly contributorsService: ContributorsService,
  ) {}

  @Get(`/contributes`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query('subProjectId', ParseUUIDPipe) subProjectId: string,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    /** get contributor filter by SubSubProject */
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const getOneSubProject = await this.subProjectsService.findOneBy({
      subProjectId,
    });

    if (!getOneSubProject)
      throw new HttpException(
        `Project ${subProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const SubSubProjects = await this.contributorsService.findAll({
      search,
      pagination,
      userId: user?.id,
      subProjectId: getOneSubProject?.id,
      projectId: getOneSubProject?.projectId,
      organizationId: getOneSubProject?.organizationId,
      type: FilterQueryType.SUBSUBPROJECT,
    });

    return reply({ res, results: SubSubProjects });
  }

  /** Get SubSubProjects */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAllSubSubProjectsBy(
    @Res() res,
    @Req() req,
    @Query('subProjectId', ParseUUIDPipe) subProjectId: string,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const getOneSubProject = await this.subProjectsService.findOneBy({
      subProjectId,
    });

    if (!getOneSubProject)
      throw new HttpException(
        `Project ${subProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const SubSubProjects = await this.subSubProjectsService.findAll({
      organizationId: getOneSubProject?.organizationId,
      projectId: getOneSubProject?.projectId,
      subProjectId: getOneSubProject?.id,
      search,
      pagination,
    });

    return reply({ res, results: SubSubProjects });
  }

  /** Create Sub SubSubProject */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneSubSubProject(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubSubProjectsDto,
  ) {
    const { user } = req;
    const { name, description, subProjectId } = body;

    const getOneSubProject = await this.subProjectsService.findOneBy({
      subProjectId,
    });

    if (!getOneSubProject)
      throw new HttpException(
        `Project ${subProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const SubSubProject = await this.subSubProjectsService.createOne({
      name,
      description,
      projectId: getOneSubProject?.projectId,
      subProjectId: getOneSubProject?.id,
      organizationId: getOneSubProject?.organizationId,
      userCreatedId: user?.id,
    });

    await this.contributorsService.createOne({
      userId: user?.id,
      subSubProjectId: SubSubProject?.id,
      userCreatedId: user?.id,
      projectId: getOneSubProject?.projectId,
      subProjectId: getOneSubProject?.id,
      role: ContributorRole.ADMIN,
      organizationId: getOneSubProject?.organizationId,
      type: FilterQueryType.SUBSUBPROJECT,
    });

    return reply({ res, results: SubSubProject });
  }

  /** Update Sub SubSubProject */
  @Put(`/:SubSubProjectId`)
  @UseGuards(JwtAuthGuard)
  async updateOneSubSubProject(
    @Res() res,
    @Req() req,
    @Body() body: UpdateSubSubProjectsDto,
    @Param('subSubProjectId', ParseUUIDPipe) subSubProjectId: string,
  ) {
    const { user } = req;
    const { name, description } = body;

    const findOneSubSubProject = await this.subSubProjectsService.findOneBy({
      subSubProjectId,
    });
    if (!findOneSubSubProject)
      throw new HttpException(
        `Project ${subSubProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const SubSubProject = await this.subSubProjectsService.updateOne(
      { option1: { subSubProjectId: findOneSubSubProject?.id } },
      { name, description, userCreatedId: user?.id },
    );

    return reply({ res, results: SubSubProject });
  }
  /** Create SubSubProject */
  @Get(`/show`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDSubSubProject(
    @Res() res,
    @Req() req,
    @Query('subSubProjectId', ParseUUIDPipe) subSubProjectId: string,
  ) {
    const { user } = req;

    const getOneSubSubProject = await this.subSubProjectsService.findOneBy({
      subSubProjectId,
    });
    if (!getOneSubSubProject)
      throw new HttpException(
        `Project ${subSubProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const getOneContributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      projectId: getOneSubSubProject?.projectId,
      subProjectId: getOneSubSubProject?.subProjectId,
      subSubProjectId: getOneSubSubProject?.id,
      organizationId: getOneSubSubProject?.organizationId,
      type: FilterQueryType.SUBSUBPROJECT,
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this project ${subSubProjectId} please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({
      res,
      results: { ...getOneSubSubProject, role: getOneContributor?.role },
    });
  }

  /** Delete SubSubProject */
  @Delete(`/:subSubProjectId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneSubSubProject(
    @Res() res,
    @Req() req,
    @Body() body: PasswordBodyDto,
    @Param('subSubProjectId', ParseUUIDPipe) subSubProjectId: string,
  ) {
    const { user } = req;
    if (!user?.checkIfPasswordMatch(body.password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const findOneSubSubProject = await this.subSubProjectsService.findOneBy({
      subSubProjectId,
    });
    if (!findOneSubSubProject)
      throw new HttpException(
        `Project ${subSubProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const findAllContributorsSubSubProjects =
      await this.contributorsService.findAllNotPaginate({
        type: FilterQueryType.SUBSUBPROJECT,
        subSubProjectId: findOneSubSubProject?.id,
        subProjectId: findOneSubSubProject?.subProjectId,
        projectId: findOneSubSubProject?.projectId,
        organizationId: findOneSubSubProject?.organizationId,
      });

    Promise.all([
      findAllContributorsSubSubProjects.map(async (item) => {
        await this.contributorsService.updateOne(
          { option1: { contributorId: item?.id } },
          { deletedAt: new Date() },
        );
      }),
    ]);

    await this.subSubProjectsService.updateOne(
      { option1: { subSubProjectId: findOneSubSubProject?.id } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Project deleted successfully' });
  }
}
