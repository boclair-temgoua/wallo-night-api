import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { config } from '../../app/config/index';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { TransactionsUtil } from '../transactions/transactions.util';
import { WalletsService } from '../wallets/wallets.service';
import { AmountModel, CardModel } from '../wallets/wallets.type';
import { PaymentsService } from './payments.service';

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
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly subscribesUtil: SubscribesUtil,
    private readonly walletsService: WalletsService,
    private readonly transactionsUtil: TransactionsUtil,
  ) {}

  /** Stripe billing */
  async stripeTokenCheck(options: {
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
    userBuyerId: string;
    organizationBuyerId: string;
  }): Promise<any> {
    const {
      token,
      userBuyerId,
      organizationBuyerId,
      description,
      amountDetail,
      currency,
      card,
    } = options;
    const {
      cardNumber,
      cardExpMonth,
      isSaveCard,
      cardExpYear,
      cardCvc,
      email,
      fullName,
    } = card;

    const { paymentMethod } = await this.stripeTokenCheck({
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
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });
    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    const findOnePayment = await this.paymentsService.findOneBy({
      cardCvc,
      cardNumber,
      cardExpYear,
      cardExpMonth,
      status: 'ACTIVE',
      organizationId: organizationBuyerId,
    });
    if (!findOnePayment && isSaveCard) {
      await this.paymentsService.createOne({
        // email,
        // fullName,
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCvc,
        type: 'CARD',
        action: 'PAYMENT',
        status: 'ACTIVE',
        userId: userBuyerId,
        brand: paymentMethod?.card?.display_brand,
        organizationId: organizationBuyerId,
      });
    }

    return { paymentIntents };
  }

  /** Stripe billing */
  async paymentsTransactionStripe(options: {
    amount: AmountModel;
    reference: string;
    userBuyerId: string;
    card: CardModel;
    organizationBuyerId: string;
    userReceiveId: string;
    membershipId: string;
  }): Promise<any> {
    const {
      amount,
      reference,
      userBuyerId,
      card,
      organizationBuyerId,
      userReceiveId,
      membershipId,
    } = options;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.stripeMethod({
      card,
      currency: amount?.currency.toUpperCase(),
      amountDetail: amount,
      token: reference,
      userBuyerId,
      organizationBuyerId,
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
          userBuyerId: userBuyerId,
          userReceiveId: userReceiveId,
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
          amountValueConvert: amountValueConvert * 100,
        });

      if (transaction?.token) {
        await this.walletsService.incrementOne({
          amount: transaction?.amountConvert,
          organizationId: transaction?.organizationId,
        });
      }
    }

    return { paymentIntents };
  }
}
