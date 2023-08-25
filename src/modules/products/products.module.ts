import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Upload } from '../../models';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Upload])],
  controllers: [ProductsController],
  providers: [ProductsService, UploadsService],
})
export class ProductsModule {}
