import {
  Controller,
  Post,
  NotFoundException,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Put,
  Res,
  Req,
  Get,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { JwtAuthGuard } from '../users/middleware';
import axios from 'axios';
import { PaymentsService } from './payments.service';
import { SubscribesService } from '../subscribes/subscribes.service';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { generateLongUUID } from '../../app/utils/commons';
import Stripe from 'stripe';
import { config } from '../../app/config/index';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly subscribesUtil: SubscribesUtil,
  ) {}

  /** Create Like */
  @Post(`/paypal/subscribe`)
  async createOnePaypalSubscribe(@Res() res, @Req() req, @Body() body) {
    const { amount, currency, membershipId, userId, paymentMethod } = body;

    const newToken = generateLongUUID(30);
    await this.subscribesUtil.createOrUpdateOneSubscribe({
      userId,
      amount: { value: amount?.value * 100, month: amount?.value },
      membershipId,
      type: 'PAYPAL',
      currency: currency.toUpperCase(),
      token: newToken,
      model: 'MEMBERSHIP',
    });

    return reply({ res, results: { toke: newToken } });
  }

  /** Create Like */
  @Post(`/stripe/subscribe`)
  async createOneStripeSubscribe(@Res() res, @Req() req, @Body() body) {
    const { amount, currency, membershipId, userId, paymentMethod } = body;

    const newToken = generateLongUUID(30);
    const { paymentIntents } = await this.paymentsService.stripeMethod({
      paymentMethod,
      currency: currency,
      amount,
      token: newToken,
      description: `Subscription ${amount?.month} user ${userId}`,
    });
    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.subscribesUtil.createOrUpdateOneSubscribe({
      userId,
      currency: paymentIntents?.currency.toUpperCase(),
      amount: { value: paymentIntents?.amount, month: amount?.value }, // Pas besoin de multiplier pas 100 stipe le fais deja
      membershipId,
      type: 'CARD',
      token: newToken,
      model: 'MEMBERSHIP',
    });
    return reply({ res, results: { token: newToken } });
  }
}
