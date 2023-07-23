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
  ParseBoolPipe,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtPayloadType } from './../users/users.type';
import { generateLongUUID } from './../../app/utils/commons/generate-random';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  FilterQueryType,
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import * as amqplib from 'amqplib';
import { ProfilesService } from '../profiles/profiles.service';
import { ProjectsService } from '../projects/projects.service';
import { CheckUserService } from '../users/middleware/check-user.service';
import { UsersService } from '../users/users.service';
import { ContributorsService } from './contributors.service';
import { JwtAuthGuard } from '../users/middleware';
import { ContributorRole } from './contributors.type';
import {
  CreateOneContributorOrganizationDto,
  CreateOneNewUserContributorsDto,
  UpdateRoleContributorDto,
} from './contributors.dto';
import { config } from '../../app/config/index';

@Controller('contributors')
export class ContributorsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
    private readonly contributorsService: ContributorsService,
  ) {}

  @Get(`/organization`)
  @UseGuards(JwtAuthGuard)
  async findAllByOrganizationId(
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
      organizationId,
    });

    return reply({ res, results: contributors });
  }

  @Post(`/organization`)
  @UseGuards(JwtAuthGuard)
  async createOneByOrganization(
    @Res() res,
    @Req() req,
    @Query() query: CreateOneContributorOrganizationDto,
  ) {
    const { user } = req;
    const { userId, organizationId } = query;
    /** This condition check if user is ADMIN */
    // await this.usersService.canPermission({ userId: user?.id });

    const getOneUser = await this.usersService.findOneBy({
      userId,
    });
    if (!getOneUser)
      throw new HttpException(
        `User ${userId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneContributorOrganization =
      await this.contributorsService.findOneBy({
        userId: getOneUser?.id,
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

  @Post(`/new-user`)
  @UseGuards(JwtAuthGuard)
  async createOneNewUser(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneNewUserContributorsDto,
  ) {
    const { email, role, firstName, lastName } = body;

    const { user } = req;

    await this.contributorsService.canCheckPermissionContributor({
      userId: user?.id,
      organizationId: user?.organizationInUtilizationId,
    });

    const findOneUser = await this.usersService.findOneBy({
      email,
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
      { userId: userSave?.id },
      { accessToken: await this.checkUserService.createJwtTokens(jwtPayload) },
    );
    /** Send notification to Contributor */
    const queue = 'user-contributor-create';
    const connect = await amqplib.connect(
      config.implementations.amqp.link,
    );
    // const channel = await connect.createChannel();
    // await channel.assertQueue(queue, { durable: false });
    // await channel.sendToQueue(
    //   queue,
    //   Buffer.from(
    //     JSON.stringify({
    //       email: userSave?.email,
    //       organization: findOneUserAdmin?.organization,
    //     }),
    //   ),
    // );
    // await userContributorCreateJob({ channel, queue });

    return reply({ res, results: 'Contributor save successfully' });
  }

  @Get(`/show/:contributorId`)
  @UseGuards(JwtAuthGuard)
  async getOneById(
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
  async deleteOne(
    @Res() res,
    @Req() req,
    @Body() body: PasswordBodyDto,
    @Param('contributorId', ParseUUIDPipe) contributorId: string,
  ) {
    const { user } = req;
    if (!user?.checkIfPasswordMatch(body.password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const findOneContributor = await this.contributorsService.findOneBy({
      contributorId,
      organizationId: user?.organizationInUtilizationId,
    });

    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.contributorsService.updateOne(
      { contributorId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Contributor deleted successfully' });
  }

  @Put(`/role`)
  @UseGuards(JwtAuthGuard)
  async updateOneRole(
    @Res() res,
    @Req() req,
    @Body() body: UpdateRoleContributorDto,
  ) {
    const { user } = req;

    const { contributorId, role } = body;

    await this.contributorsService.canCheckPermissionContributor({
      userId: user?.id,
      organizationId: user?.organizationInUtilizationId,
    });

    const findOneContributor = await this.contributorsService.findOneBy({
      contributorId,
    });
    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.contributorsService.updateOne({ contributorId }, { role });

    return reply({ res, results: 'Contributor updated successfully' });
  }
}
