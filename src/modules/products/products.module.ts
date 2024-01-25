import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount, Product, Upload } from '../../models';
import { DiscountsService } from '../discounts/discounts.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Upload, Discount])],
  controllers: [ProductsController],
  providers: [ProductsService, UploadsService, UploadsUtil, DiscountsService],
})
export class ProductsModule {}
