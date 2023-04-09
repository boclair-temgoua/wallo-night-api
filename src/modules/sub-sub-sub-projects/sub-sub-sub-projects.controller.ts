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
import { SubSubSubProjectsService } from './sub-sub-sub-projects.service';
import { JwtAuthGuard } from '../users/middleware';
import {
  UpdateSubSubSubProjectsDto,
  CreateSubSubSubProjectsDto,
} from './sub-sub-sub-projects.dto';
import { ContributorsService } from '../contributors/contributors.service';
import { ContributorRole } from '../contributors/contributors.type';
import { SubProjectsService } from '../sub-projects/sub-projects.service';
import { SubSubProjectsService } from '../sub-sub-projects/sub-sub-projects.service';

@Controller('sub-sub-sub-projects')
export class SubSubSubProjectsController {
  constructor(
    private readonly subSubSubProjectsService: SubSubSubProjectsService,
    private readonly subSubProjectsService: SubSubProjectsService,
    private readonly contributorsService: ContributorsService,
  ) {}

  @Get(`/contributes`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query('subSubProjectId', ParseUUIDPipe) subSubProjectId: string,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    /** get contributor filter by SubSubProject */
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const getOneSubSubProject = await this.subSubProjectsService.findOneBy({
      subSubProjectId,
    });

    if (!getOneSubSubProject)
      throw new HttpException(
        `Project ${subSubProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const subSubSubProjects = await this.contributorsService.findAll({
      search,
      pagination,
      userId: user?.id,
      subSubProjectId: getOneSubSubProject?.id,
      subProjectId: getOneSubSubProject?.subProjectId,
      projectId: getOneSubSubProject?.projectId,
      organizationId: getOneSubSubProject?.organizationId,
      type: FilterQueryType.SUBSUBSUBPROJECT,
    });

    return reply({ res, results: subSubSubProjects });
  }

  /** Create Sub SubSubProject */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  async createOneSubSubSubProject(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubSubSubProjectsDto,
  ) {
    const { user } = req;
    const { name, description, subSubProjectId } = body;

    const getOneSubSubProject = await this.subSubProjectsService.findOneBy({
      subSubProjectId,
    });

    if (!getOneSubSubProject)
      throw new HttpException(
        `Project ${subSubProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const subSubSubProject = await this.subSubSubProjectsService.createOne({
      name,
      description,
      organizationId: getOneSubSubProject?.organizationId,
      projectId: getOneSubSubProject?.projectId,
      subProjectId: getOneSubSubProject?.subProjectId,
      subSubProjectId: getOneSubSubProject?.id,
      userCreatedId: user?.id,
    });

    await this.contributorsService.createOne({
      userId: user?.id,
      userCreatedId: user?.id,
      role: ContributorRole.ADMIN,
      organizationId: subSubSubProject?.organizationId,
      projectId: subSubSubProject?.projectId,
      subProjectId: subSubSubProject?.subProjectId,
      subSubProjectId: subSubSubProject?.subSubProjectId,
      subSubSubProjectId: subSubSubProject?.id,
      type: FilterQueryType.SUBSUBSUBPROJECT,
    });

    return reply({ res, results: subSubSubProject });
  }

  /** Update Sub SubSubProject */
  @Put(`/:subSubSubProjectId`)
  @UseGuards(JwtAuthGuard)
  async updateOneSubSubSubProject(
    @Res() res,
    @Req() req,
    @Body() body: UpdateSubSubSubProjectsDto,
    @Param('subSubSubProjectId', ParseUUIDPipe) subSubSubProjectId: string,
  ) {
    const { user } = req;
    const { name, description } = body;

    const findOneSubSubSubProject =
      await this.subSubSubProjectsService.findOneBy({
        subSubSubProjectId,
      });
    if (!findOneSubSubSubProject)
      throw new HttpException(
        `Project ${subSubSubProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const SubSubProject = await this.subSubSubProjectsService.updateOne(
      { option1: { subSubSubProjectId: findOneSubSubSubProject?.id } },
      { name, description, userCreatedId: user?.id },
    );

    return reply({ res, results: 'SubSubProject' });
  }
  /** Get SubSubProject */
  @Get(`/show`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDSubSubSubProject(
    @Res() res,
    @Req() req,
    @Query('subSubSubProjectId', ParseUUIDPipe) subSubSubProjectId: string,
  ) {
    const { user } = req;

    const getOneSubSubSubProject =
      await this.subSubSubProjectsService.findOneBy({
        subSubSubProjectId,
      });
    if (!getOneSubSubSubProject)
      throw new HttpException(
        `Project ${subSubSubProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const getOneContributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      organizationId: getOneSubSubSubProject?.organizationId,
      projectId: getOneSubSubSubProject?.projectId,
      subProjectId: getOneSubSubSubProject?.subProjectId,
      subSubProjectId: getOneSubSubSubProject?.subSubProjectId,
      subSubSubProjectId: getOneSubSubSubProject?.id,
      type: FilterQueryType.SUBSUBSUBPROJECT,
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this project ${subSubSubProjectId} please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({
      res,
      results: { ...getOneSubSubSubProject, role: getOneContributor?.role },
    });
  }

  /** Delete SubSubProject */
  @Delete(`/:subSubSubProjectId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneSubSubProject(
    @Res() res,
    @Req() req,
    @Body() body: PasswordBodyDto,
    @Param('subSubSubProjectId', ParseUUIDPipe) subSubSubProjectId: string,
  ) {
    const { user } = req;
    if (!user?.checkIfPasswordMatch(body.password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const findOneSubSubSubProject =
      await this.subSubSubProjectsService.findOneBy({
        subSubSubProjectId,
      });
    if (!findOneSubSubSubProject)
      throw new HttpException(
        `Project ${subSubSubProjectId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const findAllContributorsSubSubProjects =
      await this.contributorsService.findAllNotPaginate({
        type: FilterQueryType.SUBSUBSUBPROJECT,
        organizationId: findOneSubSubSubProject?.organizationId,
        projectId: findOneSubSubSubProject?.projectId,
        subProjectId: findOneSubSubSubProject?.subProjectId,
        subSubProjectId: findOneSubSubSubProject?.subSubProjectId,
        subSubSubProjectId: findOneSubSubSubProject?.id,
      });

    Promise.all([
      findAllContributorsSubSubProjects.map(async (item) => {
        await this.contributorsService.updateOne(
          { option1: { contributorId: item?.id } },
          { deletedAt: new Date() },
        );
      }),
    ]);

    await this.subSubSubProjectsService.updateOne(
      { option1: { subSubSubProjectId: findOneSubSubSubProject?.id } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Project deleted successfully' });
  }
}
