import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Stripe from 'stripe';
import { config } from '../../app/config/index';
import { CreateBullingStripeOptions } from './bulling.type';

const stripe = new Stripe(String(config.implementations.stripe.key), {
  apiVersion: '2022-11-15',
});

@Injectable()
export class BullingService {
  constructor() {}

  /** Stripe billing */
  async stripeMethod(
    options: CreateBullingStripeOptions,
  ): Promise<{ charge: any }> {
    const {
      amount,
      currency,
      fullName,
      email,
      description,
      infoPaymentMethod,
    } = options;

    const params: Stripe.CustomerCreateParams = {
      description: description,
      email: email,
      name: fullName,
    };
    const customer: Stripe.Customer = await stripe.customers.create(params);

    const charge = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      description: customer?.description,
      payment_method: infoPaymentMethod?.id,
      confirm: true,
    });

    if (!charge) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    return { charge };
  }
}
