import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartOrder, Order, OrderItem, Product } from '../../models';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { ProductsService } from '../products/products.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart, OrderItem, CartOrder, Product]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    CartsService,
    ProductsService,
    OrderItemsService,
    CartOrdersService,
  ],
})
export class OrdersModule {}
