import { userContributorCreateJob } from './../../users/users.job';
import { JwtPayloadType } from './../../users/users.type';
import { generateLongUUID } from './../../../app/utils/commons/generate-random';
import {
  Controller,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Res,
  Query,
  Req,
  Post,
  Delete,
  Put,
  Body,
  Get,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { reply } from '../../../app/utils/reply';
import { JwtAuthGuard } from '../../users/middleware';
import {
  addPagination,
  PaginationType,
  RequestPaginationDto,
} from '../../../app/utils/pagination';
import {
  FilterQueryType,
  FilterQueryTypeDto,
  PasswordBodyDto,
  SearchQueryDto,
} from '../../../app/utils/search-query';
import { ContributorsService } from '../contributors.service';
import { UsersService } from '../../users/users.service';
import { ContributorRole } from '../contributors.type';
import {
  CreateOneContributorProjectDto,
  CreateOneContributorSubProjectDto,
  CreateOneContributorSubSubProjectDto,
  CreateOneContributorSubSubSubProjectDto,
  CreateOneNewUserContributorsDto,
  UpdateRoleContributorDto,
} from '../contributors.dto';
import * as amqplib from 'amqplib';
import { ProfilesService } from '../../profiles/profiles.service';
import { CheckUserService } from '../../users/middleware/check-user.service';
import { configurations } from '../../../app/configurations/index';
import { ProjectsService } from '../../projects/projects.service';
import { SubProjectsService } from '../../sub-projects/sub-projects.service';
import { SubSubProjectsService } from '../../sub-sub-projects/sub-sub-projects.service';
import { SubSubSubProjectsService } from '../../sub-sub-sub-projects/sub-sub-sub-projects.service';

@Controller('contributors')
export class ContributorsInternalController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly projectsService: ProjectsService,
    private readonly subProjectsService: SubProjectsService,
    private readonly subSubProjectsService: SubSubProjectsService,
    private readonly subSubSubProjectsService: SubSubSubProjectsService,
    private readonly checkUserService: CheckUserService,
    private readonly contributorsService: ContributorsService,
  ) {}

  @Get(`/organization`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsByOrganizationId(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() filterQueryType: FilterQueryTypeDto,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;
    /** get contributor filter by organization */
    const { search } = searchQuery;
    const { type } = filterQueryType;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      type,
      search,
      pagination,
      organizationId,
    });

    return reply({ res, results: contributors });
  }

  @Get(`/project`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsByProjectId(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const { user } = req;
    /** get contributor filter by project */
    const { search } = searchQuery;

    const getOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });
    if (!getOneProject)
      throw new HttpException(
        `Project ${projectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorProject =
      await this.contributorsService.canCheckPermissionProject({
        userId: user?.id,
        project: getOneProject,
      });
    if (!findOneContributorProject)
      throw new UnauthorizedException(
        `Not authorized in this project ${projectId}`,
      );

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      pagination,
      projectId: getOneProject?.id,
      type: FilterQueryType.PROJECT,
    });

    return reply({ res, results: contributors });
  }

  @Get(`/sub-project`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBySubProjectId(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query('subProjectId', ParseUUIDPipe) subProjectId: string,
  ) {
    const { user } = req;
    /** get contributor filter by project */
    const { search } = searchQuery;

    const getOneSubProject = await this.subProjectsService.findOneBy({
      subProjectId,
    });
    if (!getOneSubProject)
      throw new HttpException(
        `Sub project ${subProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorSubProject =
      await this.contributorsService.canCheckPermissionSubProject({
        userId: user?.id,
        subProject: getOneSubProject,
      });
    if (!findOneContributorSubProject)
      throw new UnauthorizedException(
        `Not authorized in this project ${subProjectId}`,
      );

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      pagination,
      type: FilterQueryType.SUBPROJECT,
      subProjectId: getOneSubProject?.id,
      projectId: getOneSubProject?.projectId,
      organizationId: getOneSubProject?.organizationId,
    });

    return reply({ res, results: contributors });
  }

  @Get(`/sub-sub-project`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBySubSubProjectId(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query('subSubProjectId', ParseUUIDPipe) subSubProjectId: string,
  ) {
    const { user } = req;
    /** get contributor filter by project */
    const { search } = searchQuery;

    const getOneSubSubProject = await this.subSubProjectsService.findOneBy({
      subSubProjectId,
    });
    if (!getOneSubSubProject)
      throw new HttpException(
        `Project ${subSubProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorSubSubProject =
      await this.contributorsService.canCheckPermissionSubSubProject({
        userId: user?.id,
        subSubProjectId: getOneSubSubProject?.id,
        subProjectId: getOneSubSubProject?.subProjectId,
        projectId: getOneSubSubProject?.projectId,
        organizationId: getOneSubSubProject?.organizationId,
      });
    if (!findOneContributorSubSubProject)
      throw new UnauthorizedException(
        `Not authorized in this project ${subSubProjectId}`,
      );

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      pagination,
      type: FilterQueryType.SUBSUBPROJECT,
      subSubProjectId: getOneSubSubProject?.id,
      subProjectId: getOneSubSubProject?.subProjectId,
      projectId: getOneSubSubProject?.projectId,
      organizationId: getOneSubSubProject?.organizationId,
    });

    return reply({ res, results: contributors });
  }

  @Get(`/sub-sub-sub-project`)
  @UseGuards(JwtAuthGuard)
  async findAllContributorsBySubSubSubProjectId(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query('subSubSubProjectId', ParseUUIDPipe) subSubSubProjectId: string,
  ) {
    const { user } = req;
    /** get contributor filter by project */
    const { search } = searchQuery;

    const getOneSubSubSubProject =
      await this.subSubSubProjectsService.findOneBy({
        subSubSubProjectId,
      });
    if (!getOneSubSubSubProject)
      throw new HttpException(
        `Project ${subSubSubProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorSubSubProject =
      await this.contributorsService.canCheckPermissionSubSubSubProject({
        userId: user?.id,
        subSubSubProjectId: getOneSubSubSubProject?.id,
        subSubProjectId: getOneSubSubSubProject?.subSubProjectId,
        subProjectId: getOneSubSubSubProject?.subProjectId,
        projectId: getOneSubSubSubProject?.projectId,
        organizationId: getOneSubSubSubProject?.organizationId,
      });
    if (!findOneContributorSubSubProject)
      throw new UnauthorizedException(
        `Not authorized in this project ${subSubSubProjectId}`,
      );

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      pagination,
      type: FilterQueryType.SUBSUBSUBPROJECT,
      subSubSubProjectId: getOneSubSubSubProject?.id,
      subSubProjectId: getOneSubSubSubProject?.subSubProjectId,
      subProjectId: getOneSubSubSubProject?.subProjectId,
      projectId: getOneSubSubSubProject?.projectId,
      organizationId: getOneSubSubSubProject?.organizationId,
    });

    return reply({ res, results: contributors });
  }

  @Post(`/organization`)
  @UseGuards(JwtAuthGuard)
  async createOneContributorOrganization(
    @Res() res,
    @Req() req,
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;
    /** This condition check if user is ADMIN */
    // await this.usersService.canPermission({ userId: user?.id });

    const getOneUser = await this.usersService.findOneBy({
      option1: { userId },
    });
    if (!getOneUser)
      throw new HttpException(
        `User ${userId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorOrganization =
      await this.contributorsService.findOneBy({
        userId,
        type: FilterQueryType.ORGANIZATION,
        organizationId: organizationId,
      });
    if (findOneContributorOrganization)
      throw new HttpException(
        `This contributor already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: getOneUser?.id,
      userCreatedId: user?.id,
      role: ContributorRole.ANALYST,
      organizationId: organizationId,
    });

    /** Send notification to Contributor */

    return reply({ res, results: 'Contributor save successfully' });
  }

  /** Post contributor to project */
  @Post(`/project`)
  @UseGuards(JwtAuthGuard)
  async createOneContributorProject(
    @Res() res,
    @Req() req,
    @Query() query: CreateOneContributorProjectDto,
  ) {
    const { user } = req;
    /** This condition check if user is ADMIN */
    // await this.usersService.canPermission({ userId: user?.id });

    const { userId, projectId } = query;

    const getOneProject = await this.projectsService.findOneBy({
      option1: { projectId },
    });
    if (!getOneProject)
      throw new HttpException(
        `Project ${projectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorProject =
      await this.contributorsService.canCheckPermissionProject({
        userId: userId,
        project: getOneProject,
      });

    if (findOneContributorProject)
      throw new HttpException(
        `This user ${userId} exists in this project please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: userId,
      projectId: getOneProject?.id,
      userCreatedId: user?.id,
      role: ContributorRole.ANALYST,
      organizationId: getOneProject?.organizationId,
      type: FilterQueryType.PROJECT,
    });
    /** Send notification to Contributor */

    return reply({ res, results: 'Contributor save successfully' });
  }
  /** Post contributor to sub projectId */
  @Post(`/sub-project`)
  @UseGuards(JwtAuthGuard)
  async createOneContributorSubProject(
    @Res() res,
    @Req() req,
    @Query() query: CreateOneContributorSubProjectDto,
  ) {
    const { user } = req;
    /** This condition check if user is ADMIN */
    // await this.usersService.canPermission({ userId: user?.id });

    const { userId, subProjectId } = query;

    const getOneUser = await this.usersService.findOneBy({
      option1: { userId },
    });
    if (!getOneUser)
      throw new HttpException(
        `User ${userId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    const getOneSubProject = await this.subProjectsService.findOneBy({
      subProjectId,
    });
    if (!getOneSubProject)
      throw new HttpException(
        `Sub project ${subProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorSubProject =
      await this.contributorsService.findOneBy({
        userId: userId,
        subProjectId: subProjectId,
        projectId: getOneSubProject?.projectId,
        organizationId: getOneSubProject?.organizationId,
        type: FilterQueryType.SUBPROJECT,
      });
    if (findOneContributorSubProject)
      throw new HttpException(
        `This contributor already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Check if userId exit in the project */
    const findOneContributorProject = await this.contributorsService.findOneBy({
      userId: userId,
      projectId: getOneSubProject?.projectId,
      organizationId: getOneSubProject?.organizationId,
      type: FilterQueryType.PROJECT,
    });

    if (!findOneContributorProject) {
      await this.contributorsService.createOne({
        userId: userId,
        projectId: getOneSubProject?.projectId,
        userCreatedId: user?.id,
        role: ContributorRole.ANALYST,
        organizationId: getOneSubProject?.organizationId,
        type: FilterQueryType.PROJECT,
      });
    }

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: getOneUser?.id,
      subProjectId: getOneSubProject?.id,
      userCreatedId: user?.id,
      projectId: getOneSubProject?.projectId,
      role: ContributorRole.ANALYST,
      organizationId: getOneSubProject?.organizationId,
      type: FilterQueryType.SUBPROJECT,
    });
    /** Send notification to Contributor */

    return reply({ res, results: 'Contributor save successfully' });
  }

  /** Post contributor to sub projectId */
  @Post(`/sub-sub-project`)
  @UseGuards(JwtAuthGuard)
  async createOneContributorSubSubProject(
    @Res() res,
    @Req() req,
    @Query() query: CreateOneContributorSubSubProjectDto,
  ) {
    const { user } = req;

    const { userId, subSubProjectId } = query;

    const getOneUser = await this.usersService.findOneBy({
      option1: { userId },
    });
    if (!getOneUser)
      throw new HttpException(
        `User ${userId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    const getOneSubSubProject = await this.subSubProjectsService.findOneBy({
      subSubProjectId,
    });
    if (!getOneSubSubProject)
      throw new HttpException(
        `Sub project ${subSubProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorSubSubProject =
      await this.contributorsService.findOneBy({
        userId: userId,
        subSubProjectId: subSubProjectId,
        projectId: getOneSubSubProject?.projectId,
        subProjectId: getOneSubSubProject?.subProjectId,
        organizationId: getOneSubSubProject?.organizationId,
        type: FilterQueryType.SUBSUBPROJECT,
      });
    if (findOneContributorSubSubProject)
      throw new HttpException(
        `This contributor already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Check if userId exit in the project */
    const findOneContributorProject = await this.contributorsService.findOneBy({
      userId: userId,
      projectId: getOneSubSubProject?.projectId,
      organizationId: getOneSubSubProject?.organizationId,
      type: FilterQueryType.PROJECT,
    });

    if (!findOneContributorProject) {
      await this.contributorsService.createOne({
        userId: userId,
        projectId: getOneSubSubProject?.projectId,
        userCreatedId: user?.id,
        role: ContributorRole.ANALYST,
        organizationId: getOneSubSubProject?.organizationId,
        type: FilterQueryType.PROJECT,
      });
    }

    /** Check if userId exit in the sub project */
    const findOneContributorSubProject =
      await this.contributorsService.findOneBy({
        userId: userId,
        projectId: getOneSubSubProject?.projectId,
        subProjectId: getOneSubSubProject?.subProjectId,
        organizationId: getOneSubSubProject?.organizationId,
        type: FilterQueryType.SUBPROJECT,
      });

    if (!findOneContributorSubProject) {
      await this.contributorsService.createOne({
        userId: userId,
        projectId: getOneSubSubProject?.projectId,
        subProjectId: getOneSubSubProject?.subProjectId,
        userCreatedId: user?.id,
        role: ContributorRole.ANALYST,
        organizationId: getOneSubSubProject?.organizationId,
        type: FilterQueryType.SUBPROJECT,
      });
    }

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: getOneUser?.id,
      subSubProjectId: getOneSubSubProject?.id,
      userCreatedId: user?.id,
      projectId: getOneSubSubProject?.projectId,
      subProjectId: getOneSubSubProject?.subProjectId,
      role: ContributorRole.ANALYST,
      organizationId: getOneSubSubProject?.organizationId,
      type: FilterQueryType.SUBSUBPROJECT,
    });
    /** Send notification to Contributor */

    return reply({ res, results: 'Contributor save successfully' });
  }

  /** Post contributor to sub sub sub projectId */
  @Post(`/sub-sub-sub-project`)
  @UseGuards(JwtAuthGuard)
  async createOneContributorSubSubSubProject(
    @Res() res,
    @Req() req,
    @Query() query: CreateOneContributorSubSubSubProjectDto,
  ) {
    const { user } = req;

    const { userId, subSubSubProjectId } = query;

    const getOneUser = await this.usersService.findOneBy({
      option1: { userId },
    });
    if (!getOneUser)
      throw new HttpException(
        `User ${userId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    const getOneSubSubSubProject =
      await this.subSubSubProjectsService.findOneBy({
        subSubSubProjectId,
      });
    if (!getOneSubSubSubProject)
      throw new HttpException(
        `Sub project ${subSubSubProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorSubSubSubProject =
      await this.contributorsService.findOneBy({
        userId: userId,
        subSubSubProjectId: subSubSubProjectId,
        subSubProjectId: getOneSubSubSubProject?.subSubProjectId,
        projectId: getOneSubSubSubProject?.projectId,
        subProjectId: getOneSubSubSubProject?.subProjectId,
        organizationId: getOneSubSubSubProject?.organizationId,
        type: FilterQueryType.SUBSUBSUBPROJECT,
      });
    if (findOneContributorSubSubSubProject)
      throw new HttpException(
        `This contributor already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Check if userId exit in the project */
    const findOneContributorProject = await this.contributorsService.findOneBy({
      userId: userId,
      projectId: getOneSubSubSubProject?.projectId,
      organizationId: getOneSubSubSubProject?.organizationId,
      type: FilterQueryType.PROJECT,
    });

    if (!findOneContributorProject) {
      await this.contributorsService.createOne({
        userId: userId,
        projectId: getOneSubSubSubProject?.projectId,
        userCreatedId: user?.id,
        role: ContributorRole.ANALYST,
        organizationId: getOneSubSubSubProject?.organizationId,
        type: FilterQueryType.PROJECT,
      });
    }

    /** Check if userId exit in the sub project */
    const findOneContributorSubProject =
      await this.contributorsService.findOneBy({
        userId: userId,
        projectId: getOneSubSubSubProject?.projectId,
        subProjectId: getOneSubSubSubProject?.subProjectId,
        organizationId: getOneSubSubSubProject?.organizationId,
        type: FilterQueryType.SUBPROJECT,
      });

    if (!findOneContributorSubProject) {
      await this.contributorsService.createOne({
        userId: userId,
        projectId: getOneSubSubSubProject?.projectId,
        subProjectId: getOneSubSubSubProject?.subProjectId,
        userCreatedId: user?.id,
        role: ContributorRole.ANALYST,
        organizationId: getOneSubSubSubProject?.organizationId,
        type: FilterQueryType.SUBPROJECT,
      });
    }

    /** Check if userId exit in the sub sub project */
    const findOneContributorSubSubProject =
      await this.contributorsService.findOneBy({
        userId: userId,
        projectId: getOneSubSubSubProject?.projectId,
        subProjectId: getOneSubSubSubProject?.subProjectId,
        subSubProjectId: getOneSubSubSubProject?.subSubProjectId,
        organizationId: getOneSubSubSubProject?.organizationId,
        type: FilterQueryType.SUBSUBPROJECT,
      });

    if (!findOneContributorSubSubProject) {
      await this.contributorsService.createOne({
        userId: userId,
        projectId: getOneSubSubSubProject?.projectId,
        subProjectId: getOneSubSubSubProject?.subProjectId,
        subSubProjectId: getOneSubSubSubProject?.subSubProjectId,
        userCreatedId: user?.id,
        role: ContributorRole.ANALYST,
        organizationId: getOneSubSubSubProject?.organizationId,
        type: FilterQueryType.SUBSUBPROJECT,
      });
    }

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: getOneUser?.id,
      userCreatedId: user?.id,
      subSubSubProjectId: getOneSubSubSubProject?.id,
      subSubProjectId: getOneSubSubSubProject?.subSubProjectId,
      projectId: getOneSubSubSubProject?.projectId,
      subProjectId: getOneSubSubSubProject?.subProjectId,
      role: ContributorRole.ANALYST,
      organizationId: getOneSubSubSubProject?.organizationId,
      type: FilterQueryType.SUBSUBSUBPROJECT,
    });
    /** Send notification to Contributor */

    return reply({ res, results: 'Contributor save successfully' });
  }

  @Post(`/new-user`)
  @UseGuards(JwtAuthGuard)
  async createOneNewUserContributor(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneNewUserContributorsDto,
  ) {
    const { email, role, firstName, lastName } = body;

    const { user } = req;

    const findOneUserAdmin = await this.usersService.canPermission({
      userId: user?.id,
    });

    const findOneUser = await this.usersService.findOneBy({
      option2: { email },
    });
    if (findOneUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Profile */
    const profile = await this.profilesService.createOne({
      firstName,
      lastName,
    });

    /** Create User */
    const userSave = await this.usersService.createOne({
      email,
      profileId: profile?.id,
      password: generateLongUUID(8),
      token: generateLongUUID(30),
      username: `${firstName}.${lastName}`.toLowerCase(),
      organizationInUtilizationId: user?.organizationInUtilizationId,
    });

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: userSave?.id,
      userCreatedId: user?.id,
      role: role as ContributorRole,
      organizationId: user?.organizationInUtilizationId,
    });

    /** Update User */
    const jwtPayload: JwtPayloadType = {
      id: userSave?.id,
      profileId: profile?.id,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      organizationInUtilizationId: user.organizationInUtilizationId,
    };
    await this.usersService.updateOne(
      { option1: { userId: userSave?.id } },
      { accessToken: await this.checkUserService.createJwtTokens(jwtPayload) },
    );
    /** Send notification to Contributor */
    const queue = 'user-contributor-create';
    const connect = await amqplib.connect(
      configurations.implementations.amqp.link,
    );
    const channel = await connect.createChannel();
    await channel.assertQueue(queue, { durable: false });
    await channel.sendToQueue(
      queue,
      Buffer.from(
        JSON.stringify({
          email: userSave?.email,
          organization: findOneUserAdmin?.organization,
        }),
      ),
    );
    await userContributorCreateJob({ channel, queue });

    return reply({ res, results: 'Contributor save successfully' });
  }

  @Get(`/show/:contributorId`)
  @UseGuards(JwtAuthGuard)
  async getOneByIDcontributor(
    @Res() res,
    @Req() req,
    @Param('contributorId', ParseUUIDPipe) contributorId: string,
  ) {
    const { user } = req;

    const findOneContributor = await this.contributorsService.findOneBy({
      contributorId,
      organizationId: user?.organizationInUtilizationId,
    });

    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneContributor });
  }

  @Delete(`/delete/:contributorId`)
  @UseGuards(JwtAuthGuard)
  async deleteOneContributor(
    @Res() res,
    @Req() req,
    @Body() body: PasswordBodyDto,
    @Param('contributorId', ParseUUIDPipe) contributorId: string,
  ) {
    const { user } = req;
    if (!user?.checkIfPasswordMatch(body.password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    await this.contributorsService.canCheckPermissionContributor({
      userId: user?.id,
      contributorId,
    });

    await this.contributorsService.updateOne(
      { option1: { contributorId } },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Contributor deleted successfully' });
  }

  @Put(`/role`)
  @UseGuards(JwtAuthGuard)
  async updateOneRoleContributor(
    @Res() res,
    @Req() req,
    @Body() body: UpdateRoleContributorDto,
  ) {
    const { user } = req;

    const { contributorId, role } = body;

    await this.contributorsService.canCheckPermissionContributor({
      userId: user?.id,
      contributorId,
    });

    const findOneContributor = await this.contributorsService.findOneBy({
      contributorId,
    });
    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.contributorsService.updateOne(
      { option1: { contributorId } },
      { role },
    );

    return reply({ res, results: 'Contributor updated successfully' });
  }
}
