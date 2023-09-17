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
  constructor() // private readonly createAmountAmountBalance: CreateAmountAmountBalance,
  // private readonly updateUserAfterBilling: UpdateUserAfterBilling,
  // private readonly createOrUpdateActivity: CreateOrUpdateActivity,
  {}

  /** Stripe billing */
  // async stripeMethod(options: CreateStripeBullingDto): Promise<any> {
  //   const {
  //     amount,
  //     currency,
  //     fullName,
  //     email,
  //     infoPaymentMethod,
  //     user,
  //     ipLocation,
  //     userAgent,
  //   } = {
  //     ...options,
  //   };

  //   const params: Stripe.CustomerCreateParams = {
  //     description: `Payment billing ${configurations.datasite.name} - ${fullName}`,
  //     email: email,
  //     name: fullName,
  //   };
  //   const customer: Stripe.Customer = await stripe.customers.create(params);

  //   const [error, charge] = await useCatch(
  //     stripe.paymentIntents.create({
  //       amount: Number(amount) * 100, // 25
  //       currency: currency,
  //       description: customer?.description,
  //       payment_method: infoPaymentMethod?.id,
  //       confirm: true,
  //     }),
  //   );
  //   if (error) {
  //     throw new NotFoundException(error);
  //   }

  //   if (!charge) {
  //     throw new HttpException(
  //       `Transaction not found please try again`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const [_errorBull, bulling] = await useCatch(
  //     this.createAmountAmountBalance.execute({
  //       amount: Number(charge?.amount) / 100,
  //       currency: currency,
  //       type: 'PAYMENT',
  //       paymentMethod: 'CARD-PAY',
  //       description: `Cart Transaction`,
  //       userId: user?.organizationInUtilization?.userId,
  //       organizationId: user?.organizationInUtilizationId,
  //       userCreatedId: user?.id,
  //     }),
  //   );
  //   if (_errorBull) {
  //     throw new NotFoundException(_errorBull);
  //   }

  //   const [_errorAct, _activity] = await useCatch(
  //     this.createOrUpdateActivity.execute({
  //       activityAbleType: 'PAYMENT',
  //       activityAbleId: bulling?.amountId,
  //       action: 'CARD-PAY',
  //       ipLocation,
  //       browser: userAgent,
  //       organizationId: user?.organizationInUtilizationId,
  //       applicationId: null,
  //       userCreatedId: user?.id,
  //     }),
  //   );
  //   if (_errorAct) {
  //     throw new NotFoundException(_errorAct);
  //   }
  //   /** Control and update user */
  //   const [errorUpdateUser, updateUser] = await useCatch(
  //     this.updateUserAfterBilling.execute({
  //       userInfoId: user?.organizationInUtilization?.userId,
  //     }),
  //   );
  //   if (errorUpdateUser) {
  //     throw new NotFoundException(errorUpdateUser);
  //   }

  //   return bulling;
  // }

  /** Stripe billing */
  async paypalMethod(options: any): Promise<any> {
    // const { amount, currency, ipLocation, userAgent, user } = { ...options };
    // const [_errorBull, bulling] = await useCatch(
    //   this.createAmountAmountBalance.execute({
    //     amount: Number(amount),
    //     currency: currency,
    //     type: 'PAYMENT',
    //     paymentMethod: 'PAYPAL-PAY',
    //     description: `PayPal Transaction`,
    //     userId: user?.organizationInUtilization?.userId,
    //     organizationId: user?.organizationInUtilizationId,
    //     userCreatedId: user?.id,
    //   }),
    // );
    // if (_errorBull) {
    //   throw new NotFoundException(_errorBull);
    // }
    // const [_errorAct, _activity] = await useCatch(
    //   this.createOrUpdateActivity.execute({
    //     activityAbleType: 'PAYMENT',
    //     activityAbleId: bulling?.amountId,
    //     action: 'CARD-PAY',
    //     ipLocation,
    //     browser: userAgent,
    //     organizationId: user?.organizationInUtilizationId,
    //     applicationId: null,
    //     userCreatedId: user?.id,
    //   }),
    // );
    // if (_errorAct) {
    //   throw new NotFoundException(_errorAct);
    // }
    // /** Control and update user */
    // const [errorUpdateUser, updateUser] = await useCatch(
    //   this.updateUserAfterBilling.execute({
    //     userInfoId: user?.organizationInUtilization?.userId,
    //   }),
    // );
    // if (errorUpdateUser) {
    //   throw new NotFoundException(errorUpdateUser);
    // }
    // return bulling;
  }
}
