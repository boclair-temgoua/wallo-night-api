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
import { DiscountsService } from '../discounts/discounts.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateOrUpdateProductsDto,
  GetOneProductDto,
  GetProductsDto,
} from './products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly uploadsUtil: UploadsUtil,
    private readonly productsService: ProductsService,
    private readonly discountsService: DiscountsService,
  ) {}

  /** Get all Products */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetProductsDto,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { organizationId, status, modelIds, enableVisibility } = query;
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const products = await this.productsService.findAll({
      search,
      enableVisibility,
      pagination,
      organizationId,
      status: status?.toUpperCase(),
      modelIds: modelIds ? (String(modelIds).split(',') as []) : null,
    });

    return reply({ res, results: products });
  }

  /** Post one Products */
  @Post(`/`)
  @UseGuards(UserAuthGuard)
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
      urlRedirect,
      enableLimitSlot,
      urlMedia,
      whoCanSee,
      enableVisibility,
      productType,
      enableUrlRedirect,
      enableChooseQuantity,
      messageAfterPayment,
      description,
      limitSlot,
      enableDiscount,
      discountId,
      model,
    } = body;
    const { user } = req;

    const product = await this.productsService.createOne({
      title,
      model,
      urlMedia,
      whoCanSee,
      discountId,
      productType,
      description,
      urlRedirect,
      userId: user?.id,
      messageAfterPayment,
      price: Number(price),
      limitSlot: Number(limitSlot),
      organizationId: user?.organizationId,
      currencyId: user?.profile?.currencyId,
      enableVisibility: enableVisibility === 'true' ? true : false,
      enableDiscount: enableDiscount === 'true' ? true : false,
      enableLimitSlot: enableLimitSlot === 'true' ? true : false,
      enableUrlRedirect: enableUrlRedirect === 'true' ? true : false,
      enableChooseQuantity: enableChooseQuantity === 'true' ? true : false,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      productId: product?.id,
      uploadableId: product?.id,
      model: model,
      userId: product?.userId,
      folder: 'products',
      files,
      organizationId: product?.organizationId,
    });

    return reply({ res, results: product });
  }

  /** Post one Products */
  @Put(`/:productId`)
  @UseGuards(UserAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProductsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const {
      model,
      title,
      price,
      urlRedirect,
      enableUrlRedirect,
      enableLimitSlot,
      urlMedia,
      whoCanSee,
      enableVisibility,
      productType,
      enableChooseQuantity,
      messageAfterPayment,
      description,
      limitSlot,
      discountId,
      enableDiscount,
    } = body;
    const { user } = req;

    const findOneProduct = await this.productsService.findOneBy({
      productId,
      organizationId: user?.organizationId,
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
        model,
        urlMedia,
        whoCanSee,
        discountId,
        productType,
        description,
        urlRedirect,
        messageAfterPayment,
        price: Number(price),
        limitSlot: Number(limitSlot),
        currencyId: user?.profile?.currencyId,
        enableVisibility: enableVisibility === 'true' ? true : false,
        enableDiscount: enableDiscount === 'true' ? true : false,
        enableLimitSlot: enableLimitSlot === 'true' ? true : false,
        enableUrlRedirect: enableUrlRedirect === 'true' ? true : false,
        enableChooseQuantity: enableChooseQuantity === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      productId: productId,
      userId: user?.id,
      uploadableId: productId,
      model: model,
      folder: 'products',
      files,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: 'Product updated successfully' });
  }

  /** Get one Products */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOneProductDto) {
    const { productId, productSlug, organizationId, enableVisibility } = query;

    const findOneProduct = await this.productsService.findOneBy({
      enableVisibility,
      productId,
      productSlug,
      organizationId,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} ${productSlug} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return reply({ res, results: findOneProduct });
  }

  /** Delete one Products */
  @Delete(`/:productId`)
  @UseGuards(UserAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const { user } = req;
    const findOneProduct = await this.productsService.findOneBy({
      productId,
      organizationId: user?.organizationId,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.productsService.updateOne(
      { productId: findOneProduct?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Product deleted successfully' });
  }
}
