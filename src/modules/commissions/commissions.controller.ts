import {
  Controller,
  Post,
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
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import * as mime from 'mime-types';
import {
  formateNowDateYYMMDD,
  generateLongUUID,
} from '../../app/utils/commons';

import { CommissionsService } from './commissions.service';
import {
  PasswordBodyDto,
  SearchQueryDto,
} from '../../app/utils/search-query/search-query.dto';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import {
  CreateOrUpdateCommissionsDto,
  GetCommissionsDto,
  GetOneCommissionDto,
} from './commissions.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
  awsS3ServiceAdapter,
  getFileToAws,
} from '../integrations/aws/aws-s3-service-adapter';
import { UploadsUtil } from '../uploads/uploads.util';

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
    const { userId, status } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const commissions = await this.commissionsService.findAll({
      search,
      userId,
      pagination,
      status: status?.toUpperCase(),
    });

    return reply({ res, results: commissions });
  }

  /** Post one Commissions */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
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
      enableLimitSlot,
      messageAfterPayment,
    } = body;
    const { user } = req;

    const commission = await this.commissionsService.createOne({
      title,
      price: Number(price),
      urlMedia,
      description,
      messageAfterPayment,
      currencyId: user?.profile?.currencyId,
      userId: user?.id,
      limitSlot: Number(limitSlot),
      enableLimitSlot: enableLimitSlot === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'COMMISSION',
      uploadableId: commission?.id,
      userId: commission?.userId,
      folder: 'commissions',
      files,
    });

    return reply({ res, results: 'commission' });
  }

  /** Post one Commissions */
  @Put(`/:commissionId`)
  @UseGuards(JwtAuthGuard)
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
      enableLimitSlot,
      messageAfterPayment,
    } = body;
    const { user } = req;

    const findOneCommission = await this.commissionsService.findOneBy({
      commissionId,
      userId: user?.id,
    });
    if (!findOneCommission)
      throw new HttpException(
        `Commission ${commissionId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.commissionsService.updateOne(
      { commissionId },
      {
        title,
        price: Number(price),
        urlMedia,
        description,
        messageAfterPayment,
        currencyId: user?.profile?.currencyId,
        limitSlot: Number(limitSlot),
        enableLimitSlot: enableLimitSlot === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      model: 'COMMISSION',
      uploadableId: commissionId,
      userId: user?.id,
      folder: 'commissions',
      files,
    });

    return reply({ res, results: 'commission updated successfully' });
  }

  /** Post one Commissions */
  @Put(`/:commissionId`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateOneOld(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateCommissionsDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('commissionId', ParseUUIDPipe) commissionId: string,
  ) {
    const { user } = req;
    const { title, price, description, messageAfterPayment, urlMedia } = body;
    const attachment = req.file;
    let fileName;

    if (attachment) {
      const nameFile = `${formateNowDateYYMMDD(new Date())}${generateLongUUID(
        8,
      )}`;
      await awsS3ServiceAdapter({
        name: nameFile,
        mimeType: file?.mimetype,
        folder: 'posts',
        file: file.buffer,
      });
      const extension = mime.extension(file.mimetype);
      fileName = `${nameFile}.${extension}`;
    }

    const findOneCommission = await this.commissionsService.findOneBy({
      commissionId,
      userId: user?.id,
    });
    if (!findOneCommission)
      throw new HttpException(
        `Commission ${commissionId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.commissionsService.updateOne(
      { commissionId },
      {
        title,
        price: Number(price),
        urlMedia,
        description,
        image: fileName,
        messageAfterPayment,
      },
    );

    return reply({ res, results: 'commission updated successfully' });
  }

  /** Get one Commissions */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOneCommissionDto) {
    const { commissionId, commissionSlug, userId } = query;

    const findOneCommission = await this.commissionsService.findOneBy({
      commissionId,
      userId,
    });
    if (!findOneCommission)
      throw new HttpException(
        `Commission ${commissionId} ${commissionSlug} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneCommission });
  }

  /** Delete one Commissions */
  @Delete(`/delete/:commissionId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Body() body: PasswordBodyDto,
    @Param('commissionId', ParseUUIDPipe) commissionId: string,
  ) {
    const { user } = req;
    const { password } = body;
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    await this.commissionsService.updateOne(
      { commissionId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'commission deleted successfully' });
  }
}
