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
import { reply } from '../../app/utils/reply';

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  PaginationType,
  RequestPaginationDto,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { UploadsUtil } from '../uploads/uploads.util';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateOrUpdateCommissionsDto,
  GetCommissionsDto,
  GetOneCommissionDto,
} from './commissions.dto';
import { CommissionsService } from './commissions.service';

@Controller('commissions')
export class CommissionsController {
  constructor(
    private readonly commissionsService: CommissionsService,
    private readonly uploadsUtil: UploadsUtil,
  ) {}

  /** Get all Commissions */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetCommissionsDto,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { organizationId, status } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const commissions = await this.commissionsService.findAll({
      search,
      organizationId,
      pagination,
      status: status?.toUpperCase(),
    });

    return reply({ res, results: commissions });
  }

  /** Post one Commissions */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCommissionsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const {
      title,
      price,
      description,
      urlMedia,
      limitSlot,
      discountId,
      enableLimitSlot,
      enableDiscount,
      messageAfterPayment,
    } = body;
    const { user } = req;

    const commission = await this.commissionsService.createOne({
      title,
      price: Number(price),
      urlMedia,
      description,
      discountId,
      userId: user?.id,
      organizationId: user?.organizationId,
      messageAfterPayment,
      currencyId: user?.profile?.currencyId,
      limitSlot: Number(limitSlot),
      enableDiscount: enableDiscount === 'true' ? true : false,
      enableLimitSlot: enableLimitSlot === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'COMMISSION',
      commissionId: commission?.id,
      uploadableId: commission?.id,
      userId: commission?.userId,
      folder: 'commissions',
      files,
      organizationId: commission?.organizationId,
    });

    return reply({ res, results: 'commission save successfully' });
  }

  /** Post one Commissions */
  @Put(`/:commissionId`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCommissionsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('commissionId', ParseUUIDPipe) commissionId: string,
  ) {
    const {
      title,
      price,
      description,
      urlMedia,
      limitSlot,
      discountId,
      enableLimitSlot,
      enableDiscount,
      messageAfterPayment,
    } = body;
    const { user } = req;

    const findOneCommission = await this.commissionsService.findOneBy({
      commissionId,
      organizationId: user?.organizationId,
    });
    if (!findOneCommission)
      throw new HttpException(
        `Commission ${commissionId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.commissionsService.updateOne(
      { commissionId: findOneCommission?.id },
      {
        title,
        price: Number(price),
        urlMedia,
        description,
        discountId,
        messageAfterPayment,
        currencyId: user?.profile?.currencyId,
        limitSlot: Number(limitSlot),
        enableDiscount: enableDiscount === 'true' ? true : false,
        enableLimitSlot: enableLimitSlot === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'COMMISSION',
      commissionId: commissionId,
      uploadableId: commissionId,
      userId: findOneCommission?.id,
      folder: 'commissions',
      files,
      organizationId: findOneCommission?.organizationId,
    });

    return reply({ res, results: 'commission updated successfully' });
  }

  /** Get one Commissions */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOneCommissionDto) {
    const { commissionId, commissionSlug, organizationId } = query;

    const findOneCommission = await this.commissionsService.findOneBy({
      commissionId,
      organizationId,
    });
    if (!findOneCommission)
      throw new HttpException(
        `Commission ${commissionId} ${commissionSlug} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneCommission });
  }

  /** Delete one Commissions */
  @Delete(`/:commissionId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('commissionId', ParseUUIDPipe) commissionId: string,
  ) {
    const findOneCommission = await this.commissionsService.findOneBy({
      commissionId,
    });

    await this.commissionsService.updateOne(
      { commissionId: findOneCommission?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'commission deleted successfully' });
  }
}
