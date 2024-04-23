import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartOrder, Order, OrderItem, Product, User } from '../../models';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
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
        ]),
    ],
    controllers: [OrdersController],
    providers: [
        OrdersService,
        CartsService,
        OrdersUtil,
        ProductsService,
        UsersService,
        OrderItemsService,
        CartOrdersService,
    ],
})
export class OrdersModule {}
