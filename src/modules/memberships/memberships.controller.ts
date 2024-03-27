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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from '../../app/utils/search-query';
import { CurrenciesService } from '../currencies/currencies.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateOrUpdateMembershipsDto,
  GetMembershipDto,
  GetOneMembershipDto,
} from './memberships.dto';
import { MembershipsService } from './memberships.service';

@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly uploadsUtil: UploadsUtil,
    private readonly currenciesService: CurrenciesService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: GetMembershipDto,
    @Query() paginationDto: PaginationDto,
  ) {
    const { userId, organizationId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const memberships = await this.membershipsService.findAll({
      search,
      userId,
      organizationId,
      pagination,
    });

    return reply({ res, results: memberships });
  }

  /** Post one Memberships */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateMembershipsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { user } = req;
    const { title, description, messageWelcome, price, month } = body;

    const membership = await this.membershipsService.createOne({
      title,
      description,
      messageWelcome,
      price: Number(price),
      month: Number(month),
      userId: user?.id,
      organizationId: user?.organizationId,
      currencyId: user?.profile?.currencyId,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'MEMBERSHIP',
      membershipId: membership?.id,
      uploadableId: membership?.id,
      userId: membership?.userId,
      folder: 'memberships',
      files,
      organizationId: membership?.organizationId,
    });

    return reply({ res, results: 'membership created successfully' });
  }

  /** Post one Memberships */
  @Put(`/:membershipId`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateMembershipsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const { title, description, messageWelcome, price, month } = body;
    const { user } = req;

    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
      organizationId: user?.organizationId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `membership ${membershipId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.membershipsService.updateOne(
      { membershipId },
      {
        title,
        description,
        messageWelcome,
        price: Number(price),
        month: Number(month),
        currencyId: user?.profile?.currencyId,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'MEMBERSHIP',
      membershipId: findOneMembership?.id,
      uploadableId: findOneMembership?.id,
      userId: findOneMembership?.userId,
      folder: 'memberships',
      files,
      organizationId: findOneMembership?.organizationId,
    });

    return reply({ res, results: 'membership updated successfully' });
  }

  /** Get one Memberships */
  @Get(`/view`)
  async getOne(@Res() res, @Req() req, @Query() query: GetOneMembershipDto) {
    const { membershipId, organizationId } = query;

    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
      organizationId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `Membership ${membershipId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneMembership });
  }

  // @Get(`/show/:membershipId`)
  // async getOne(
  //   @Res() res,
  //   @Param('membershipId', ParseUUIDPipe) membershipId: string,
  // ) {
  //   const findOneMembership = await this.membershipsService.findOneBy({
  //     membershipId,
  //   });
  //   if (!findOneMembership)
  //     throw new HttpException(
  //       `Membership ${membershipId} don't exists please change`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   return reply({ res, results: findOneMembership });
  // }

  /** Active one Memberships */
  // @Get(`/status`)
  // @UseGuards(UserAuthGuard)
  // async changeStatusOne(
  //   @Res() res,
  //   @Req() req,
  //   @Query('membershipId', ParseUUIDPipe) membershipId: string,
  // ) {
  //   const findOneMembership = await this.membershipsService.findOneBy({
  //     membershipId,
  //   });
  //   if (!findOneMembership)
  //     throw new HttpException(
  //       `membership ${membershipId} don't exists please change`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   await this.membershipsService.updateOne(
  //     { membershipId },
  //     { isActive: !findOneMembership?.isActive },
  //   );

  //   return reply({ res, results: 'membership update successfully' });
  // }

  /** Delete one Memberships */
  @Delete(`/:membershipId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('membershipId', ParseUUIDPipe) membershipId: string,
  ) {
    const { user } = req;
    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
      organizationId: user?.organizationId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `Membership ${membershipId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.membershipsService.updateOne(
      { membershipId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'membership deleted successfully' });
  }
}
