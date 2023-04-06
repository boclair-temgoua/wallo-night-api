import {
  Controller,
  ParseUUIDPipe,
  Res,
  Query,
  Req,
  Post,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { reply } from '../../../app/utils/reply';
import {
  addPagination,
  PaginationType,
  RequestPaginationDto,
} from '../../../app/utils/pagination';
import { SearchQueryDto } from '../../../app/utils/search-query';
import { ContributorsService } from '../contributors.service';
import { UsersService } from '../../users/users.service';
import { ContributorRole } from '../contributors.type';
import { UnauthorizedException } from '@nestjs/common';
import { FilterQueryType } from '../../../app/utils/search-query/search-query.dto';

@Controller('re/contributors')
export class ContributorsExternalController {
  constructor(
    private readonly contributorsService: ContributorsService,
    private readonly usersService: UsersService,
  ) {}

  @Get(`/`)
  async findAllContributorsBy(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    /** get contributor filter by organization */
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributors = await this.contributorsService.findAll({
      search,
      pagination,
      userId: user?.application?.userId,
      type: FilterQueryType.ORGANIZATION,
    });

    return reply({ res, results: contributors });
  }

  @Post(`/`)
  async createOneContributor(
    @Res() res,
    @Req() req,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    const { user } = req;
    const findOneUser = await this.usersService.findOneInfoBy({
      option1: { userId: user?.id },
    });
    /** This condition check if user is ADMIN */
    if (!['ADMIN'].includes(findOneUser?.role?.name))
      throw new UnauthorizedException('Not authorized! Change permission');

    const findOneContributor = await this.contributorsService.findOneBy({
      userId,
      organizationId: user?.application?.organizationId,
      type: FilterQueryType.ORGANIZATION,
    });
    if (findOneContributor)
      throw new HttpException(
        `This contributor already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Create Contributor */
    await this.contributorsService.createOne({
      userId: userId,
      userCreatedId: user?.id,
      role: ContributorRole.MODERATOR,
      organizationId: user?.application?.organizationId,
    });

    /** Send notification to Contributor */

    return reply({ res, results: 'contributor save successfully' });
  }

  @Get(`/show`)
  async getOneByIDcontributor(
    @Res() res,
    @Req() req,
    @Query('contributorId', ParseUUIDPipe) contributorId: string,
  ) {
    const { user } = req;

    const findOneContributor = await this.contributorsService.findOneBy({
      contributorId,
      organizationId: user?.application?.organizationId,
    });

    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneContributor });
  }
}
