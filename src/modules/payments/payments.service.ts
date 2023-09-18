import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import Stripe from 'stripe';
import { config } from '../../app/config/index';

const stripe = new Stripe(String(config.implementations.stripe.key), {
  apiVersion: '2023-08-16',
});

@Injectable()
export class PaymentsService {
  constructor() {} // private readonly createOrUpdateActivity: CreateOrUpdateActivity, // private readonly updateUserAfterBilling: UpdateUserAfterBilling, // private readonly createAmountAmountBalance: CreateAmountAmountBalance,

  /** Stripe billing */
  async stripeMethod(options: {
    description?: string;
    amount: any;
    token: string;
    currency: string;
    paymentMethod: any;
  }): Promise<any> {
    const { token, description, amount, currency, paymentMethod } = options;

    const params: Stripe.CustomerCreateParams = {
      description: description,
      email: paymentMethod?.billing_details?.email,
      name: paymentMethod?.billing_details?.name,
    };
    const customer: Stripe.Customer = await stripe.customers.create(params);
    const paymentIntents = await stripe.paymentIntents.create({
      amount: Number(amount?.value) * 100, // 25
      currency: currency,
      description: customer?.description,
      payment_method: paymentMethod?.id,
      confirm: true,
      return_url: `${config.url.client}/success?token=${token}`,
    });

    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    return { paymentIntents };
  }
}
