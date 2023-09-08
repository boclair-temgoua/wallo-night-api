import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Upload } from '../../models';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Upload])],
  controllers: [ProductsController],
  providers: [ProductsService, UploadsService, UploadsUtil],
})
export class ProductsModule {}
