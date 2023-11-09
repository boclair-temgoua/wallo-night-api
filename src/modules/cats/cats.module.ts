import { Product } from './../../models/Product';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartOrder } from '../../models';
import { CartsController } from './cats.controller';
import { CartsService } from './cats.service';
import { ProductsService } from '../products/products.service';
import { CartOrderController } from '../cart-orders/cart-orders.controller';
import { CartOrdersService } from '../cart-orders/cart-orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, CartOrder])],
  controllers: [CartsController, CartOrderController],
  providers: [CartsService, ProductsService, CartOrdersService],
})
export class CartsModule {}
