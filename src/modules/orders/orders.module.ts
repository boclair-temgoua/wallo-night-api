import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, Order, OrderItem } from '../../models';
import { CartsService } from '../cats/cats.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Cart, OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService, CartsService, OrderItemsService],
})
export class OrdersModule {}
