import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEvent, Upload } from '../../models';
import { OrderEventsController } from './order-events.controller';
import { OrderEventsService } from './order-events.service';
import { OrderEventsUtil } from './order-events.util';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEvent, Upload])],
  controllers: [OrderEventsController],
  providers: [OrderEventsService, OrderEventsUtil, UploadsService],
})
export class OrderEventsModule {}
