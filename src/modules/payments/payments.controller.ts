import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { PaymentsService } from './payments.service';
import { WalletsService } from '../wallets/wallets.service';
import { OurEventsUtil } from '../our-events/our-events.util';
import { OrderEventsService } from '../order-events/order-events.service';
import { OrderEventsUtil } from '../order-events/order-events.util';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly walletsService: WalletsService,
    private readonly ourEventsUtil: OurEventsUtil,
    private readonly orderEventsUtil: OrderEventsUtil,
    private readonly orderEventsService: OrderEventsService,
  ) {}

  /** Create Payment */
  @Post(`/paypal/payment`)
  async createOnePaypalSubscribe(@Res() res, @Req() req, @Body() body) {
    const { amount, eventId, userId, reference } = body;

    const { transaction } = await this.ourEventsUtil.createOrUpdateOneSubscribe(
      {
        userId,
        amount: { value: amount?.value * 100 },
        eventId,
        type: 'PAYPAL',
        currency: amount?.currency.toUpperCase(),
        token: reference,
        model: 'EVENT',
        description: `Pagamento di un evento`,
      },
    );

    if (transaction?.organizationId) {
      await this.walletsService.incrementOne({
        amount: transaction?.amount,
        organizationId: transaction?.organizationId,
      });

      for (let i = 0; i < amount?.quantity; i++) {
        await this.orderEventsUtil.createAndGeneratePDF({ transaction });
      }
    }

    return reply({ res, results: reference });
  }

  /** Create Payment */
  @Post(`/stripe/payment`)
  async createOneStripeSubscribe(@Res() res, @Req() req, @Body() body) {
    const { amount, eventId, userId, reference, paymentMethod } = body;

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      paymentMethod,
      amount,
      token: reference,
      description: `Pagamento di un evento`,
    });
    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    const { transaction } = await this.ourEventsUtil.createOrUpdateOneSubscribe(
      {
        userId,
        currency: paymentIntents?.currency.toUpperCase(),
        amount: { value: paymentIntents?.amount }, // Pas besoin de multiplier pas 100 stipe le fais deja
        eventId,
        type: 'CARD',
        token: reference,
        model: 'EVENT',
        description: paymentIntents?.description,
      },
    );

    if (transaction?.organizationId) {
      await this.walletsService.incrementOne({
        amount: transaction?.amount,
        organizationId: transaction?.organizationId,
      });

      for (let i = 0; i < amount?.quantity; i++) {
        await this.orderEventsUtil.createAndGeneratePDF({ transaction });
      }
    }

    return reply({ res, results: reference });
  }
}
