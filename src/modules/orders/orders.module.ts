import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Cart,
  CartOrder,
  Membership,
  Order,
  OrderItem,
  Product,
  User,
} from '../../models';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { MembershipsService } from '../memberships/memberships.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersUtil } from './orders.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Cart,
      OrderItem,
      CartOrder,
      Product,
      User,
      Membership,
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    CartsService,
    OrdersUtil,
    ProductsService,
    UsersService,
    MembershipsService,
    OrderItemsService,
    CartOrdersService,
  ],
})
export class OrdersModule {}
