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

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadsUtil: UploadsUtil,
  ) {}

  /** Get all Products */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() query: GetProductsDto,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { userId, status } = query;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const products = await this.productsService.findAll({
      search,
      pagination,
      userId,
      status: status ? status.toUpperCase() : null,
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
      messageAfterPayment,
      description,
      limitSlot,
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
      discountId,
      messageAfterPayment,
      currencyId: user?.profile?.currencyId,
      enableDiscount: enableDiscount === 'true' ? true : false,
      isLimitSlot: isLimitSlot === 'true' ? true : false,
      isChooseQuantity: isChooseQuantity === 'true' ? true : false,
      userId: user?.id,
    });

    await this.uploadsUtil.saveOrUpdateAws({
      productId: product?.id,
      folder: 'products',
      files,
    });

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
      messageAfterPayment,
      description,
      limitSlot,
      discountId,
      enableDiscount,
    } = body;
    const { user } = req;

    const findOneProduct = await this.productsService.findOneBy({
      productId,
      userId: user?.id,
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
        discountId,
        messageAfterPayment,
        limitSlot: Number(limitSlot),
        currencyId: user?.profile?.currencyId,
        enableDiscount: enableDiscount === 'true' ? true : false,
        isLimitSlot: isLimitSlot === 'true' ? true : false,
        isChooseQuantity: isChooseQuantity === 'true' ? true : false,
      },
    );

    await this.uploadsUtil.saveOrUpdateAws({
      productId: productId,
      folder: 'products',
      files,
    });

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
