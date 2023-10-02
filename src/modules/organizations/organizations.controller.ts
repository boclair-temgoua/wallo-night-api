import {
  Controller,
  ParseUUIDPipe,
  UseGuards,
  Res,
  Get,
  Req,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  addPagination,
  PaginationType,
  RequestPaginationDto,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { reply } from '../../app/utils/reply';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../users/middleware';
import { ContributorsService } from '../contributors/contributors.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
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
    /** get contributor filter by organization */
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const organizations = await this.contributorsService.findAll({
      userId: user?.id,
      search,
      pagination,
    });

    return reply({ res, results: organizations });
  }

  @Get(`/view`)
  @UseGuards(JwtAuthGuard)
  async getOne(
    @Res() res,
    @Req() req,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;

    const findOrganization = await this.organizationsService.findOneBy({
      organizationId,
    });
    if (!findOrganization)
      throw new HttpException(
        `Organization ${organizationId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const getOneContributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      organizationId,
      type: 'ORGANIZATION',
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this organization ${organizationId} please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({
      res,
      results: { ...findOrganization, role: getOneContributor?.role },
    });
  }
}
