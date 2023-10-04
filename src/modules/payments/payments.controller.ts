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
import { WalletsService } from '../wallets/wallets.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly walletsService: WalletsService,
    private readonly subscribesUtil: SubscribesUtil,
  ) {}

  /** Create Like */
  @Post(`/paypal/subscribe`)
  async createOnePaypalSubscribe(@Res() res, @Req() req, @Body() body) {
    const { amount, currency, membershipId, userId, reference, paymentMethod } =
      body;

    const { transaction } =
      await this.subscribesUtil.createOrUpdateOneSubscribe({
        userId,
        amount: { value: amount?.value * 100, month: amount?.value },
        membershipId,
        type: 'PAYPAL',
        currency: currency.toUpperCase(),
        token: reference,
        model: 'MEMBERSHIP',
      });

    if (transaction?.token) {
      await this.walletsService.incrementOne({
        userId: transaction?.userReceiveId,
        amount: transaction?.amount,
      });
    }

    return reply({ res, results: reference });
  }

  /** Create Like */
  @Post(`/stripe/subscribe`)
  async createOneStripeSubscribe(@Res() res, @Req() req, @Body() body) {
    const { amount, currency, membershipId, userId, reference, paymentMethod } =
      body;

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      paymentMethod,
      currency: currency,
      amount,
      token: reference,
      description: `Subscription ${amount?.month} user ${userId}`,
    });
    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    const { transaction } =
      await this.subscribesUtil.createOrUpdateOneSubscribe({
        userId,
        currency: paymentIntents?.currency.toUpperCase(),
        amount: { value: paymentIntents?.amount, month: amount?.value }, // Pas besoin de multiplier pas 100 stipe le fais deja
        membershipId,
        type: 'CARD',
        token: reference,
        model: 'MEMBERSHIP',
      });

    if (transaction?.token) {
      await this.walletsService.incrementOne({
        userId: transaction?.userReceiveId,
        amount: transaction?.amount,
      });
    }
    
    return reply({ res, results: reference });
  }
}
