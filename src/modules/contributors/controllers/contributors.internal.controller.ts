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
import { SearchQueryDto } from '../../../app/utils/search-query';
import { ContributorsService } from '../contributors.service';
import { UsersService } from '../../users/users.service';
import { ContributorRole, ContributorType } from '../contributors.type';
import {
  CreateOneContributorProjectDto,
  CreateOneContributorSubProjectDto,
  CreateOneNewUserContributorsDto,
  UpdateRoleContributorDto,
} from '../contributors.dto';
import * as amqplib from 'amqplib';
import { ProfilesService } from '../../profiles/profiles.service';
import { CheckUserService } from '../../users/middleware/check-user.service';
import { configurations } from '../../../app/configurations/index';
import { ProjectsService } from '../../projects/projects.service';
import { SubProjectsService } from '../../sub-projects/sub-projects.service';

@Controller('contributors')
export class ContributorsInternalController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly projectsService: ProjectsService,
    private readonly subProjectsService: SubProjectsService,
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
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;
    /** get contributor filter by organization */
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      pagination,
      option1: {
        organizationId,
        type: ContributorType.ORGANIZATION,
      },
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
        projectId: getOneProject?.id,
        organizationId: getOneProject?.organizationId,
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
      option3: {
        projectId: getOneProject?.id,
        type: ContributorType.PROJECT,
        organizationId: getOneProject?.organizationId,
      },
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
      option1: { subProjectId },
    });
    if (!getOneSubProject)
      throw new HttpException(
        `Sub project ${subProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const getOneProject = await this.projectsService.findOneBy({
      option1: { projectId: getOneSubProject?.projectId },
    });
    if (!getOneProject)
      throw new HttpException(
        `Project ${getOneSubProject?.projectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      pagination,
      option4: {
        projectId: getOneProject?.id,
        type: ContributorType.SUBPROJECT,
        subProjectId: getOneSubProject?.id,
        organizationId: getOneSubProject?.organizationId,
      },
    });

    return reply({ res, results: contributors });
  }

  @Post(`/organization`)
  @UseGuards(JwtAuthGuard)
  async createOneContributorOrganization(
    @Res() res,
    @Req() req,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    const { user } = req;
    /** This condition check if user is ADMIN */
    await this.usersService.canPermission({ userId: user?.id });

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
        option1: {
          userId,
          type: ContributorType.ORGANIZATION,
          organizationId: user?.organizationInUtilizationId,
        },
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
      role: ContributorRole.MODERATOR,
      organizationId: user?.organizationInUtilizationId,
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
    await this.usersService.canPermission({ userId: user?.id });

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
        projectId: getOneProject?.id,
        organizationId: getOneProject?.organizationId,
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
      role: ContributorRole.MODERATOR,
      organizationId: getOneProject?.organizationId,
      type: ContributorType.PROJECT,
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
    await this.usersService.canPermission({ userId: user?.id });

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
      option1: { subProjectId },
    });
    if (!getOneSubProject)
      throw new HttpException(
        `Sub project ${subProjectId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorSubProject =
      await this.contributorsService.findOneBy({
        option5: {
          userId: userId,
          subProjectId: subProjectId,
          projectId: getOneSubProject?.projectId,
          organizationId: getOneSubProject?.organizationId,
          type: ContributorType.SUBPROJECT,
        },
      });
    if (findOneContributorSubProject)
      throw new HttpException(
        `This contributor already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: getOneUser?.id,
      subProjectId: getOneSubProject?.id,
      userCreatedId: user?.id,
      projectId: getOneSubProject?.projectId,
      role: ContributorRole.MODERATOR,
      organizationId: getOneSubProject?.organizationId,
      type: ContributorType.SUBPROJECT,
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
      option3: {
        contributorId,
        organizationId: user?.organizationInUtilizationId,
      },
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
    @Param('contributorId', ParseUUIDPipe) contributorId: string,
  ) {
    const { user } = req;

    const findOneContributor = await this.contributorsService.findOneBy({
      option3: {
        contributorId,
        organizationId: user?.organizationInUtilizationId,
      },
    });
    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.contributorsService.deleteOne({
      option1: { contributorId },
    });

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
    const findOneUser = await this.usersService.findOneInfoBy({
      option1: { userId: user?.id },
    });
    /** This condition check if user is ADMIN */
    if (!['ADMIN'].includes(findOneUser?.role?.name))
      throw new UnauthorizedException('Not authorized! Change permission');

    const { contributorId, role } = body;

    const findOneContributor = await this.contributorsService.findOneBy({
      option3: {
        contributorId,
        organizationId: user?.organizationInUtilizationId,
      },
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
