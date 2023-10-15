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
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { WalletsService } from '../wallets/wallets.service';
import { CreateSubscribePaymentsDto } from './payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly walletsService: WalletsService,
    private readonly subscribesUtil: SubscribesUtil,
  ) {}

  /** Create Like */
  @Post(`/paypal/subscribe`)
  async createOnePaypalSubscribe(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const { amount, membershipId, userId, reference, paymentMethod } = body;

    const { transaction } =
      await this.subscribesUtil.createOrUpdateOneSubscribe({
        userId,
        amount: {
          currency: amount?.currency.toUpperCase(),
          value: amount?.value * 100,
          month: amount?.month,
        },
        membershipId,
        type: 'PAYPAL',
        token: reference,
        model: 'MEMBERSHIP',
        description: `Subscription ${amount?.month} month`,
      });

    if (transaction?.token) {
      await this.walletsService.incrementOne({
        organizationId: transaction?.organizationId,
        amount: transaction?.amount,
      });
    }

    return reply({ res, results: reference });
  }

  /** Create Like */
  @Post(`/stripe/subscribe`)
  async createOneStripeSubscribe(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const { amount, membershipId, userId, reference, paymentMethod } = body;

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      paymentMethod,
      currency: amount?.currency.toUpperCase(),
      amount,
      token: reference,
      description: `Subscription ${amount?.month} month`,
    });
    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (paymentIntents) {
      const { transaction } =
        await this.subscribesUtil.createOrUpdateOneSubscribe({
          userId,
          amount: {
            currency: paymentIntents?.currency.toUpperCase(),
            value: amount?.value * 100,
            month: amount?.month,
          }, // Pas besoin de multiplier pas 100 stipe le fais deja
          membershipId,
          type: 'CARD',
          token: reference,
          model: 'MEMBERSHIP',
          description: paymentIntents?.description,
        });

      if (transaction?.token) {
        await this.walletsService.incrementOne({
          organizationId: transaction?.organizationId,
          amount: transaction?.amount,
        });
      }
    }

    return reply({ res, results: reference });
  }
}
