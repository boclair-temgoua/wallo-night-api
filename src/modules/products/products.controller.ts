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
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
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
import {
  CreateOrUpdateProductsDto,
  GetOneProductDto,
  GetProductsDto,
} from './products.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadsUtil } from '../uploads/uploads.util';
import { DiscountsService } from '../discounts/discounts.service';
import { isNotUndefined } from '../../app/utils/commons/generate-random';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadsUtil: UploadsUtil,
    private readonly discountsService: DiscountsService,
  ) {}

  /** Get all Products */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetProductsDto,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { organizationId, status } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const products = await this.productsService.findAll({
      search,
      pagination,
      organizationId,
      status: status?.toUpperCase(),
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
      urlRedirect,
      enableLimitSlot,
      urlMedia,
      whoCanSee,
      productType,
      enableUrlRedirect,
      enableChooseQuantity,
      messageAfterPayment,
      description,
      limitSlot,
      membershipId,
      enableDiscount,
      discountId,
    } = body;
    const { user } = req;

    const product = await this.productsService.createOne({
      title,
      price: Number(price),
      limitSlot: Number(limitSlot),
      urlMedia,
      description,
      urlRedirect,
      whoCanSee,
      productType,
      membershipId,
      messageAfterPayment,
      currencyId: user?.profile?.currencyId,
      discountId: isNotUndefined(discountId) ? discountId : null,
      enableDiscount: enableDiscount === 'true' ? true : false,
      enableLimitSlot: enableLimitSlot === 'true' ? true : false,
      enableChooseQuantity: enableChooseQuantity === 'true' ? true : false,
      enableUrlRedirect: enableUrlRedirect === 'true' ? true : false,
      organizationId: user?.organizationId,
      userId: user?.id,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      uploadableId: product?.id,
      model: 'PRODUCT',
      userId: product?.userId,
      folder: 'products',
      files,
      organizationId: product?.organizationId,
    });

    return reply({ res, results: product });
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
      urlRedirect,
      enableUrlRedirect,
      enableLimitSlot,
      urlMedia,
      whoCanSee,
      productType,
      enableChooseQuantity,
      messageAfterPayment,
      description,
      limitSlot,
      membershipId,
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
        price: Number(price),
        urlMedia,
        description,
        urlRedirect,
        whoCanSee,
        productType,
        membershipId,
        messageAfterPayment,
        limitSlot: Number(limitSlot),
        currencyId: user?.profile?.currencyId,
        discountId: isNotUndefined(discountId) ? discountId : null,
        enableDiscount: enableDiscount === 'true' ? true : false,
        enableLimitSlot: enableLimitSlot === 'true' ? true : false,
        enableChooseQuantity: enableChooseQuantity === 'true' ? true : false,
        enableUrlRedirect: enableUrlRedirect === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      userId: user?.id,
      uploadableId: productId,
      model: 'PRODUCT',
      folder: 'products',
      files,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: 'Product updated successfully' });
  }

  /** Get one Products */
  @Get(`/view`)
  async getOne(@Res() res, @Query() query: GetOneProductDto) {
    const { productId, productSlug, organizationId } = query;

    const findOneProduct = await this.productsService.findOneBy({
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
  @UseGuards(JwtAuthGuard)
  async deleteOne(
    @Res() res,
    @Req() req,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    await this.productsService.updateOne(
      { productId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Product deleted successfully' });
  }
}
