import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TransactionsService } from '../transactions/transactions.service';
import {
  OrderEvent,
  OurEvent,
  Transaction,
  Wallet,
  Upload,
} from '../../models';
import { WalletsService } from '../wallets/wallets.service';
import { OurEventsUtil } from '../our-events/our-events.util';
import { OurEventsService } from '../our-events/our-events.service';
import { OrderEventsService } from '../order-events/order-events.service';
import { OrderEventsUtil } from '../order-events/order-events.util';
import { UploadsService } from '../uploads/uploads.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallet,
      Transaction,
      OurEvent,
      OrderEvent,
      Upload,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    WalletsService,
    TransactionsService,
    OurEventsUtil,
    OurEventsService,
    OrderEventsUtil,
    UploadsService,
    OrderEventsService,
  ],
})
export class PaymentsModule {}
