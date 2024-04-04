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
import { config } from '../../../app/config';
import {
  dateTimeNowUtc,
  generateLongUUID,
  generateNumber,
} from '../../../app/utils/commons';
import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../../app/utils/pagination';
import { reply } from '../../../app/utils/reply';
import { SearchQueryDto } from '../../../app/utils/search-query';
import {
  ConfirmInvitationContributorsDto,
  CreateOneNewUserContributorsDto,
  UpdateRoleContributorsDto,
} from '../../contributors/contributors.dto';
import { ContributorsService } from '../../contributors/contributors.service';
import { TokenContributorModel } from '../../contributors/contributors.type';
import { OrganizationsService } from '../../organizations/organizations.service';
import { ProfilesService } from '../../profiles/profiles.service';
import { CheckUserService } from '../middleware/check-user.service';
import { UserAuthGuard } from '../middleware/cookie/user-auth.guard';
import { TokenUserDto } from '../users.dto';
import { confirmInvitationJod } from '../users.job';
import { UsersService } from '../users.service';
import { UsersUtil } from '../users.util';

@Controller('contributors')
export class ContributorUserController {
  constructor(
    private readonly usersUtil: UsersUtil,
    private readonly usersService: UsersService,
    private readonly organizationService: OrganizationsService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
    private readonly contributorsService: ContributorsService,
  ) {}

  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() PaginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search, organizationId, userId } = searchQuery;

    const { take, page, sort } = PaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      userId,
      pagination,
      organizationId,
    });

    return reply({ res, results: contributors });
  }

  @Get(`/invited/:userId`)
  @UseGuards(UserAuthGuard)
  async createOneOrganization(
    @Res() res,
    @Req() req,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const { user } = req;
    let contributor: any = {};
    await this.contributorsService.canCheckPermissionContributor({
      userId: user?.id,
    });
    const findOneUser = await this.usersService.findOneBy({
      userId,
    });
    if (!findOneUser || user?.id === userId) {
      throw new HttpException(
        `User invited not valid please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    contributor = await this.contributorsService.findOneBy({
      userId,
      organizationId: user?.organizationId,
    });

    // cette controlle si le contributeur existe au cas contraire il le cree puis envoie l'email par la suite
    if (!contributor) {
      /** Create Contributor */
      contributor = await this.contributorsService.createOne({
        userId,
        userCreatedId: user?.id,
        organizationId: user?.organizationId,
        role: 'MODERATOR',
        status: 'INVITED-CONTRIBUTOR',
      });
    }

    const tokenUser = await this.checkUserService.createToken(
      {
        userId: findOneUser.id,
        contributorId: contributor.id,
        contributorStatus: contributor?.status,
        guest: {
          lastName: findOneUser?.profile?.lastName,
          firstName: findOneUser?.profile?.firstName,
        },
        user: {
          email: user?.email,
          organizationName: user?.organization?.name,
          firstName: user?.profile?.firstName,
          lastName: user?.profile?.lastName,
        },
      },
      config.cookie_access.verifyExpire,
    );

    /** Send information to Job */
    await confirmInvitationJod({
      email: findOneUser?.email,
      token: tokenUser,
      nameOrganization: user?.organization?.name,
      fullNameInviter: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
    });

    return reply({ res, results: 'Contributor save successfully' });
  }

  @Post(`/`)
  @UseGuards(UserAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneNewUserContributorsDto,
  ) {
    const { user } = req;
    const { email, role, firstName, lastName } = body;
    const findOneUser = await this.usersService.findOneBy({
      email,
    });
    if (findOneUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const { user: newUser, contributor: userContributor } =
      await this.usersUtil.saveOrUpdate({
        role: 'ADMIN',
        email,
        lastName,
        firstName,
        provider: 'DEFAULT',
        password: generateLongUUID(10),
        username: `${firstName}-${lastName}-${generateNumber(4)}`,
        confirmedAt: null,
      });

    const contributor = await this.contributorsService.createOne({
      role,
      userId: newUser?.id,
      userCreatedId: user?.id,
      status: 'NEW-CONTRIBUTOR',
      organizationId: user?.organizationId,
    });

    await this.usersService.updateOne(
      { userId: newUser?.id },
      { organizationId: user?.organizationId },
    );

    const tokenUser = await this.checkUserService.createToken(
      {
        userId: newUser.id,
        contributorId: contributor.id,
        userContributorId: userContributor.id,
        contributorStatus: contributor?.status,
        guest: {
          lastName: lastName,
          firstName: firstName,
        },
        user: {
          email: newUser?.email,
          lastName: user?.profile?.lastName,
          firstName: user?.profile?.firstName,
          organizationName: user?.organization?.name,
        },
      } as TokenContributorModel,
      config.cookie_access.verifyExpire,
    );

    /** Send information to Job */
    await confirmInvitationJod({
      email: newUser?.email,
      token: tokenUser,
      nameOrganization: user?.organization?.name,
      fullNameInviter: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
    });

    return reply({ res, results: 'Contributor save successfully' });
  }

  @Put(`/confirm/:token`)
  async confirmOneInvitation(
    @Res() res,
    @Req() req,
    @Body() body: ConfirmInvitationContributorsDto,
    @Param() params: TokenUserDto,
  ) {
    const { firstName, lastName, password } = body;

    const payload = (await this.checkUserService.verifyToken(
      params?.token,
    )) as TokenContributorModel;

    const findOnUser = await this.usersService.findOneBy({
      userId: payload?.userId,
    });
    if (!findOnUser)
      throw new HttpException(
        `User already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.usersService.updateOne(
      { userId: findOnUser?.id },
      {
        password,
        confirmedAt: dateTimeNowUtc(),
        emailConfirmedAt: dateTimeNowUtc(),
      },
    );

    // Update contributor created by investor
    await this.contributorsService.updateOne(
      { contributorId: payload?.contributorId },
      { confirmedAt: dateTimeNowUtc() },
    );

    // Update contributor
    await this.contributorsService.updateOne(
      { contributorId: payload?.userContributorId },
      { confirmedAt: dateTimeNowUtc() },
    );

    await this.profilesService.updateOne(
      { profileId: findOnUser?.profileId },
      { firstName, lastName },
    );

    return reply({ res, results: 'Contributor update successfully' });
  }

  @Put(`/:contributorId`)
  @UseGuards(UserAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: UpdateRoleContributorsDto,
    @Param('contributorId', ParseUUIDPipe) contributorId: string,
  ) {
    const { role } = body;
    const { user } = req;

    const findOneContributor = await this.contributorsService.findOneBy({
      contributorId,
      organizationId: user?.organizationId,
    });

    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.contributorsService.updateOne({ contributorId }, { role: role });

    return reply({ res, results: 'Contributor update successfully' });
  }

  @Delete(`/:contributorId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('contributorId', ParseUUIDPipe) contributorId: string,
  ) {
    const { user } = req;

    const findOneContributor = await this.contributorsService.findOneBy({
      contributorId,
      organizationId: user?.organizationId,
    });
    if (!findOneContributor) {
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    const findOneOriginalOrganization =
      await this.organizationService.findOneBy({
        userId: findOneContributor?.userId,
      });
    if (!findOneOriginalOrganization) {
      throw new HttpException(
        `This organization dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.usersService.updateOne(
      { userId: findOneOriginalOrganization?.userId },
      { organizationId: findOneOriginalOrganization?.id },
    );

    await this.contributorsService.updateOne(
      { contributorId },
      { deletedAt: dateTimeNowUtc() },
    );

    return reply({ res, results: 'Contributor deleted successfully' });
  }
}
