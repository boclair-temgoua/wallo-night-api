import {
  Controller,
  Param,
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
import { FilterQueryType, SearchQueryDto } from '../../app/utils/search-query';
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
      option1: { userId: user?.id, type: FilterQueryType.ORGANIZATION },
      search,
      pagination,
    });

    return reply({ res, results: organizations });
  }

  @Get(`/:organizationId`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDOrganization(
    @Res() res,
    @Req() req,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;

    const organization = await this.organizationsService.findOneBy({
      option1: { organizationId },
    });

    const getOneContributor = await this.contributorsService.findOneBy({
      option1: {
        userId: user?.id,
        organizationId: organization?.id,
        type: FilterQueryType.ORGANIZATION,
      },
    });
    if (!getOneContributor)
      throw new HttpException(
        `Not authorized in this organization ${organizationId} please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({
      res,
      results: { ...organization, role: getOneContributor?.role },
    });
  }
}
