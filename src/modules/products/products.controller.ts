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

import { ProductsService } from './products.service';
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
import { CreateOrUpdateProductsDto, GetOneProductDto } from './products.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '../uploads/uploads.service';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadsService: UploadsService,
  ) {}

  /** Get all Products */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const products = await this.productsService.findAll({
      search,
      pagination,
    });

    return reply({ res, results: products });
  }

  /** Post one Products */
  @Post(`/`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProductsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const {
      title,
      price,
      isLimitSlot,
      urlMedia,
      isChooseQuantity,
      messageAfterPurchase,
      description,
      limitSlot,
    } = body;
    const { user } = req;

    const product = await this.productsService.createOne({
      title,
      price: Number(price),
      limitSlot: Number(limitSlot),
      urlMedia,
      description,
      messageAfterPurchase,
      isLimitSlot: isLimitSlot === 'true' ? true : false,
      isChooseQuantity: isChooseQuantity === 'true' ? true : false,
      userId: user?.id,
    });

    Promise.all([
      files
        .filter((lk: any) => lk?.fieldname === 'attachmentImages')
        .map(async (file) => {
          const nameFile = `${formateNowDateYYMMDD(
            new Date(),
          )}${generateLongUUID(8)}`;

          const urlAWS = await awsS3ServiceAdapter({
            name: nameFile,
            mimeType: file?.mimetype,
            folder: 'products',
            file: file.buffer,
          });
          const extension = mime.extension(file.mimetype);
          const fileName = `${nameFile}.${extension}`;

          await this.uploadsService.createOne({
            name: file?.originalname,
            path: fileName,
            status: 'success',
            url: urlAWS.Location,
            uploadType: 'IMAGE',
            productId: product?.id,
          });
        }),

      files
        .filter((lk: any) => lk?.fieldname === 'attachmentFiles')
        .map(async (file) => {
          const nameFile = `${formateNowDateYYMMDD(
            new Date(),
          )}${generateLongUUID(8)}`;

          const urlAWS = await awsS3ServiceAdapter({
            name: nameFile,
            mimeType: file?.mimetype,
            folder: 'products',
            file: file.buffer,
          });
          const extension = mime.extension(file.mimetype);
          const fileName = `${nameFile}.${extension}`;

          await this.uploadsService.createOne({
            name: file?.originalname,
            path: fileName,
            status: 'success',
            url: urlAWS.Location,
            uploadType: 'FILE',
            productId: product?.id,
          });
        }),
    ]);

    return reply({ res, results: 'product' });
  }

  /** Post one Products */
  @Put(`/:productId`)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProductsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const {
      title,
      price,
      isLimitSlot,
      urlMedia,
      isChooseQuantity,
      messageAfterPurchase,
      description,
      limitSlot,
    } = body;

    const findOneProduct = await this.productsService.findOneBy({
      productId,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.productsService.updateOne(
      { productId },
      {
        title,
        price: Number(price),
        urlMedia,
        description,
        messageAfterPurchase,
        limitSlot: Number(limitSlot),
        isLimitSlot: isLimitSlot === 'true' ? true : false,
        isChooseQuantity: isChooseQuantity === 'true' ? true : false,
      },
    );
    


    console.log('files =====>',files)
    Promise.all([
      files
        .filter((lk: any) => lk?.fieldname === 'attachmentImages')
        .map(async (file) => {
          const nameFile = `${formateNowDateYYMMDD(
            new Date(),
          )}${generateLongUUID(8)}`;

          const urlAWS = await awsS3ServiceAdapter({
            name: nameFile,
            mimeType: file?.mimetype,
            folder: 'products',
            file: file.buffer,
          });
          const extension = mime.extension(file.mimetype);
          const fileName = `${nameFile}.${extension}`;

          await this.uploadsService.createOne({
            name: file?.originalname,
            path: fileName,
            status: 'success',
            url: urlAWS.Location,
            uploadType: 'IMAGE',
            productId: productId,
          });
        }),

      files
        .filter((lk: any) => lk?.fieldname === 'attachmentFiles')
        .map(async (file) => {
          const nameFile = `${formateNowDateYYMMDD(
            new Date(),
          )}${generateLongUUID(8)}`;

          const urlAWS = await awsS3ServiceAdapter({
            name: nameFile,
            mimeType: file?.mimetype,
            folder: 'products',
            file: file.buffer,
          });
          const extension = mime.extension(file.mimetype);
          const fileName = `${nameFile}.${extension}`;

          await this.uploadsService.createOne({
            name: file?.originalname,
            path: fileName,
            status: 'success',
            url: urlAWS.Location,
            uploadType: 'FILE',
            productId: productId,
          });
        }),
    ]);

    return reply({ res, results: 'Product updated successfully' });
  }

  /** Get one Products */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOneProductDto) {
    const { productId, productSlug, userId } = query;

    const findOneProduct = await this.productsService.findOneBy({
      productId,
      userId,
      productSlug,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} ${productSlug} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneProduct });
  }

  /** Delete one Products */
  @Delete(`/delete/:productId`)
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Body() body: PasswordBodyDto,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const { user } = req;
    const { password } = body;
    if (!user?.checkIfPasswordMatch(password))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    await this.productsService.updateOne(
      { productId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Product deleted successfully' });
  }
}
