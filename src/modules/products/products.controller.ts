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
import { CreateOrUpdateProductsDto } from './products.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  @UseInterceptors(FileInterceptor('attachments'))
  async createOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProductsDto,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    console.log('files ===========>',files)
    const { user } = req;
    const product = await this.productsService.createOne({
      ...body,
      userCreatedId: user?.id,
    });

    return reply({ res, results: product });
  }

  /** Post one Products */
  @Put(`/:productId`)
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProductsDto,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const findOneProduct = await this.productsService.findOneBy({
      productId,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.productsService.updateOne({ productId }, { ...body });

    return reply({ res, results: 'Product updated successfully' });
  }

  /** Get one Products */
  @Get(`/show/:productId`)
  async getOne(
    @Res() res,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    const findOneProduct = await this.productsService.findOneBy({
      productId,
    });
    if (!findOneProduct)
      throw new HttpException(
        `Product ${productId} don't exists please change`,
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
