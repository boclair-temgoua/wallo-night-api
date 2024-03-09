import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { config } from '../../app/config/index';
import { AmountModel, CardModel } from '../wallets/wallets.type';

const apiVersion = '2023-10-16';
const stripePrivate = new Stripe(
  String(config.implementations.stripe.privateKey),
  { apiVersion },
);

const stripePublic = new Stripe(
  String(config.implementations.stripe.publicKey),
  { apiVersion },
);

@Injectable()
export class PaymentsUtil {
  constructor() {}

  /** Stripe billing */
  async stripeTokenCreate(options: {
    name: string;
    email?: string;
    cardNumber?: string;
    cardExpMonth?: number;
    cardExpYear?: number;
    cardCvc?: string;
    token?: string;
  }): Promise<any> {
    const { name, email, cardNumber, cardExpMonth, cardExpYear, cardCvc } =
      options;
    const billingDetails: Stripe.CustomerCreateParams = {
      name: name,
      email: email,
    };
    const paymentMethod = await stripePublic.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber.split(' ').join(''),
        exp_month: Number(cardExpMonth),
        exp_year: Number(cardExpYear),
        cvc: cardCvc,
      },
      billing_details: billingDetails,
    });
    if (!paymentMethod) {
      throw new HttpException(`Invalid card`, HttpStatus.NOT_ACCEPTABLE);
    }

    const customer: Stripe.Customer =
      await stripePrivate.customers.create(billingDetails);
    if (!customer) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }
    return { paymentMethod, customer };
  }

  /** Stripe billing */
  async stripeMethod(options: {
    description?: string;
    amountDetail: AmountModel;
    token: string;
    currency: string;
    card: CardModel;
  }): Promise<any> {
    const { token, description, amountDetail, currency, card } = options;
    const { cardNumber, cardExpMonth, cardExpYear, cardCvc, email, fullName } =
      card;

    const { paymentMethod } = await this.stripeTokenCreate({
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      email,
      name: fullName,
    });

    const paymentIntents = await stripePrivate.paymentIntents.create({
      amount: Number(amountDetail?.value) * 100, // 25
      currency: currency,
      description: description,
      payment_method: paymentMethod?.id,
      payment_method_types: [paymentMethod?.type],
      confirm: true,
      confirmation_method: 'manual', // For 3D Security
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

  /** Cart execution */
  // async cartExecution(options: {
  //   cartOrderId: string;
  //   userBuyerId: string;
  //   organizationId: string;
  // }): Promise<any> {
  //   const { cartOrderId, userBuyerId, organizationId } = options;

  //   const { summary, cartItems } = await this.cartsService.findAll({
  //     userId: userBuyerId,
  //     status: 'ADDED',
  //     cartOrderId,
  //     organizationSellerId: organizationId,
  //   });

  //   if (!summary && cartItems.length <= 0) {
  //     throw new HttpException(
  //       `Cart not found please try again`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   return { summary, cartItems };
  // }
}
