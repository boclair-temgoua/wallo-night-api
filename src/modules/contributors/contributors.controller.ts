import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaginationType, addPagination } from '../../app/utils/pagination';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { reply } from '../../app/utils/reply';
import {
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { UserAuthGuard } from '../users/middleware';
import { CheckUserService } from '../users/middleware/check-user.service';
import { UsersService } from '../users/users.service';
import { generateLongUUID } from './../../app/utils/commons/generate-random';
import { JwtPayloadType } from './../users/users.type';
import {
  CreateOneNewUserContributorsDto,
  UpdateRoleContributorDto,
} from './contributors.dto';
import { ContributorsService } from './contributors.service';
import { ContributorRole } from './contributors.type';

@Controller('contributors')
export class ContributorsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
    private readonly contributorsService: ContributorsService,
  ) {}

  /** Get all Contributors */
  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      pagination,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: contributors });
  }

  @Post(`/`)
  @UseGuards(UserAuthGuard)
  async createOneNewUser(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneNewUserContributorsDto,
  ) {
    const { email, role, firstName, permission, lastName } = body;

    const { user } = req;

    const username = `${firstName}.${lastName}`.toLocaleLowerCase();
    await this.contributorsService.canCheckPermissionContributor({
      userId: user?.id,
    });
    const findOneUser = await this.usersService.findOneBy({
      email,
    });
    const findOnUserByUsername = await this.usersService.findOneBy({
      username: username,
    });
    if (findOneUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Profile */
    const profile = await this.profilesService.createOne({
      fullName: `${firstName} ${lastName}`,
      lastName,
      firstName,
    });

    /** Create User */
    const usernameGenerate = `${generateLongUUID(8)}`.toLowerCase();
    const userSave = await this.usersService.createOne({
      email,
      permission,
      password: generateLongUUID(8),
      profileId: profile?.id,
      username: username
        ? findOnUserByUsername
          ? usernameGenerate
          : username
        : usernameGenerate,
      token: generateLongUUID(30),
      organizationId: user?.organizationId,
    });

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: userSave?.id,
      userCreatedId: user?.id,
      role: role as ContributorRole,
      organizationId: userSave?.organizationId,
    });

    /** Update User */
    const jwtPayload: JwtPayloadType = {
      id: userSave?.id,
      profileId: profile?.id,
      organizationId: userSave.organizationId,
    };
    // await this.usersService.updateOne(
    //   { userId: userSave?.id },
    //   { accessToken: await this.checkUserService.createJwtTokens(jwtPayload) },
    // );
    /** Send notification to Contributor */
    // const queue = 'user-contributor-create';
    // const connect = await amqplib.connect(config.implementations.amqp.link);
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
  @UseGuards(UserAuthGuard)
  async getOneById(
    @Res() res,
    @Req() req,
    @Param('contributorId', ParseUUIDPipe) contributorId: string,
  ) {
    const { user } = req;

    const findOneContributor = await this.contributorsService.findOneBy({
      contributorId,
    });

    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneContributor });
  }

  @Delete(`/delete/:contributorId`)
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
  async updateOneRole(
    @Res() res,
    @Req() req,
    @Body() body: UpdateRoleContributorDto,
  ) {
    const { user } = req;

    const { contributorId, role } = body;

    await this.contributorsService.canCheckPermissionContributor({
      userId: user?.id,
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
