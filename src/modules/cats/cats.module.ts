import { Product } from './../../models/Product';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../../models/Cart';
import { CartsController } from './cats.controller';
import { CartsService } from './cats.service';
import { ProductsService } from '../products/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product])],
  controllers: [CartsController],
  providers: [CartsService, ProductsService],
})
export class CartsModule {}
