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
  Put,
  Body,
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
import { UpdateOrganizationDto } from './organizations.dto';

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

  /** Post one Categories */
  @Put(`/:organizationId`)
  @UseGuards(JwtAuthGuard)
  async updateOneCategory(
    @Res() res,
    @Req() req,
    @Body() body: UpdateOrganizationDto,
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const findOneOrganization = await this.organizationsService.findOneBy({
      organizationId,
    });
    if (!findOneOrganization)
      throw new HttpException(
        `Organization ${findOneOrganization} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.organizationsService.updateOne({ organizationId }, { ...body });

    return reply({ res, results: 'Organization save successfully' });
  }

  @Get(`/show`)
  @UseGuards(JwtAuthGuard)
  async getOneByUUIDOrganization(
    @Res() res,
    @Req() req,
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    const { user } = req;

    const organization = await this.organizationsService.findOneBy({
      organizationId,
    });
    if (!organization)
      throw new HttpException(
        `Organization ${organizationId} don't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const getOneContributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      organizationId: organization?.id,
      type: FilterQueryType.ORGANIZATION,
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
