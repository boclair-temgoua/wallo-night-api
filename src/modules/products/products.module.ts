import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Upload, Discount } from '../../models';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { DiscountsService } from '../discounts/discounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Upload, Discount])],
  controllers: [ProductsController],
  providers: [ProductsService, UploadsService, UploadsUtil, DiscountsService],
})
export class ProductsModule {}
