import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartOrder } from '../../models';
import { CartOrdersService } from './cart-orders.service';
import { CartOrderController } from './cart-orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartOrder])],
  controllers: [CartOrderController],
  providers: [CartOrdersService],
})
export class CartOrdersModule {}
