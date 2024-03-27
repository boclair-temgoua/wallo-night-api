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
import { reply } from '../../app/utils/reply';

import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { ContributorsUtil } from '../contributors/contributors.util';
import { ProductsService } from '../products/products.service';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateOrUpdateAffiliationsDto,
  GetAffiliationDto,
  GetOneAffiliationDto,
} from './affiliations.dto';
import { AffiliationsService } from './affiliations.service';

@Controller('affiliations')
export class AffiliationsController {
  constructor(
    private readonly affiliationsService: AffiliationsService,
    private readonly contributorsUtil: ContributorsUtil,
    private readonly productsService: ProductsService,
    //private readonly usersService: UsersService,
  ) {}

  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAllByUserNotPaginate(
    @Res() res,
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: GetAffiliationDto,
  ) {
    const { search } = searchQuery;
    const { organizationReceivedId, organizationSellerId } = query;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const affiliations = await this.affiliationsService.findAll({
      search,
      pagination,
      organizationSellerId,
      organizationReceivedId,
    });

    return reply({ res, results: affiliations });
  }

  /** Post one Affiliations */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateAffiliationsDto,
  ) {
    const { user } = req;
    const { percent, description, expiredAt, productId, email } = body;

    const { user: findOneUser, organization: findOneOrganization } =
      await this.contributorsUtil.findOneUserOrganizationContributor({
        email,
      });

    const findOneProduct = await this.productsService.findOneBy({
      productId,
      organizationId: user.organizationId,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneAffiliation = await this.affiliationsService.findOneBy({
      productId,
      userReceivedId: findOneUser.id,
      organizationReceivedId: findOneOrganization.id,
    });
    if (findOneAffiliation)
      throw new HttpException(
        `This affiliation exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.affiliationsService.createOne({
      percent,
      description,
      expiredAt,
      title: findOneProduct?.title,
      productId: findOneProduct?.id,
      organizationSellerId: findOneProduct?.organizationId,
      userReceivedId: findOneUser?.id,
      organizationReceivedId: findOneOrganization?.id,
    });

    return reply({ res, results: 'Affiliation created successfully' });
  }

  /** Post one Discounts */
  @Put(`/:affiliationId`)
  @UseGuards(UserAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateAffiliationsDto,
    @Param('affiliationId', ParseUUIDPipe) affiliationId: string,
  ) {
    const { percent, description, expiredAt, productId } = body;
    const findOneAffiliation = await this.affiliationsService.findOneBy({
      affiliationId,
    });
    if (!findOneAffiliation)
      throw new HttpException(
        `Affiliation ${affiliationId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.affiliationsService.updateOne(
      { affiliationId },
      {
        percent,
        description,
        expiredAt,
        productId,
      },
    );

    return reply({ res, results: 'Affiliation updated successfully' });
  }

  /** Get one Affiliation */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOneAffiliationDto) {
    const { affiliationId, slug } = query;
    const findOneAffiliation = await this.affiliationsService.findOneBy({
      affiliationId,
      slug,
    });

    return reply({ res, results: findOneAffiliation });
  }

  /** Delete one Affiliation */
  @Delete(`/:affiliationId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('affiliationId', ParseUUIDPipe) affiliationId: string,
  ) {
    const { user } = req;
    const findOneAffiliation = await this.affiliationsService.findOneBy({
      affiliationId,
      organizationSellerId: user?.organizationId,
    });
    if (!findOneAffiliation)
      throw new HttpException(
        `Affiliation ${affiliationId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    await this.affiliationsService.updateOne(
      { affiliationId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Affiliation deleted successfully' });
  }
}
