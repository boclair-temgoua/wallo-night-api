import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { CommentsService } from '../comments/comments.service';
import { CommissionsService } from '../commissions/commissions.service';
import { OrdersUtil } from '../orders/orders.util';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsUtil } from '../transactions/transactions.util';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateSubscribePaymentsDto } from './payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsTransactionController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly walletsService: WalletsService,
    private readonly transactionsUtil: TransactionsUtil,
    private readonly subscribesUtil: SubscribesUtil,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
    private readonly ordersUtil: OrdersUtil,
    private readonly commissionsService: CommissionsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  /** Create subscribe */
  @Post(`/paypal/subscribe`)
  async createOnePaypalSubscribe(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const { amount, membershipId, userReceiveId, userSendId, reference } = body;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { transaction } =
      await this.subscribesUtil.createOrUpdateOneSubscribe({
        userSendId: userSendId,
        userReceiveId: userReceiveId,
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
        amountValueConvert: amountValueConvert * 100,
      });

    if (transaction?.token) {
      await this.walletsService.incrementOne({
        amount: transaction?.amountConvert,
        organizationId: transaction?.organizationId,
      });
    }

    return reply({ res, results: reference });
  }

  /** Create subscribe */
  @Post(`/stripe/subscribe`)
  async createOneStripeSubscribe(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const { amount, membershipId, userReceiveId, userSendId, reference, card } =
      body;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      card,
      currency: amount?.currency.toUpperCase(),
      amountDetail: amount,
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
          userSendId: userSendId,
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

    return reply({ res, results: reference });
  }

  /** Create Donation */
  @Post(`/paypal/donation`)
  async createOnePaypalDonation(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const {
      amount,
      organizationBuyerId,
      userReceiveId,
      userSendId,
      reference,
    } = body;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const transaction = await this.transactionsService.createOne({
      userSendId: userSendId,
      userReceiveId: userReceiveId,
      amount: amount?.value * 100,
      currency: amount?.currency.toUpperCase(),
      organizationId: organizationBuyerId,
      type: 'PAYPAL',
      token: reference,
      model: 'DONATION',
      fullName: 'Somebody',
      description: amount?.description || 'bought un pot',
      amountConvert: amountValueConvert * 100,
    });

    if (transaction?.token) {
      await this.walletsService.incrementOne({
        amount: transaction?.amountConvert,
        organizationId: transaction?.organizationId,
      });

      await this.commentsService.createOne({
        model: transaction?.model,
        color: transaction?.color,
        email: transaction?.email,
        userId: transaction?.userSendId,
        fullName: transaction?.fullName,
        description: transaction?.description,
        userReceiveId: transaction?.userReceiveId,
        organizationId: transaction?.organizationId,
      });
    }

    return reply({ res, results: reference });
  }

  /** Create Donation */
  @Post(`/stripe/donation`)
  async createOneStripeDonation(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const {
      amount,
      organizationBuyerId,
      userReceiveId,
      userSendId,
      reference,
      card,
    } = body;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      card,
      currency: amount?.currency.toUpperCase(),
      amountDetail: amount,
      token: reference,
      description: amount?.description || 'bought un pot',
    });
    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (paymentIntents) {
      const transaction = await this.transactionsService.createOne({
        userSendId: userSendId,
        userReceiveId: userReceiveId,
        amount: amount?.value * 100,
        currency: paymentIntents?.currency.toUpperCase(),
        organizationId: organizationBuyerId,
        type: 'CARD',
        token: reference,
        model: 'DONATION',
        email: card?.email,
        fullName: card?.fullName ?? 'Somebody',
        description: paymentIntents?.description,
        amountConvert: amountValueConvert * 100,
      });

      if (transaction?.token) {
        await this.walletsService.incrementOne({
          amount: transaction?.amountConvert,
          organizationId: transaction?.organizationId,
        });

        await this.commentsService.createOne({
          model: transaction?.model,
          color: transaction?.color,
          email: transaction?.email,
          userId: transaction?.userSendId,
          fullName: transaction?.fullName,
          description: transaction?.description,
          userReceiveId: transaction?.userReceiveId,
          organizationId: transaction?.organizationId,
        });
      }
    }

    return reply({ res, results: reference });
  }

  /** Create Shop */
  @Post(`/paypal/shop`)
  async createOnePaypalShop(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const {
      amount,
      organizationSellerId,
      userReceiveId,
      userSendId,
      reference,
      cartOrderId,
      card,
      userAddress,
    } = body;
    const findOneUser = await this.usersService.findOneBy({
      userId: userSendId,
    });
    if (!findOneUser) {
      throw new HttpException(
        `This user ${userSendId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { order } = await this.ordersUtil.orderShopCreate({
      organizationBuyerId: findOneUser?.organizationId,
      userBeyerId: userSendId,
      cartOrderId,
      organizationSellerId,
      userAddress,
    });

    const transaction = await this.transactionsService.createOne({
      userSendId: findOneUser?.id,
      userReceiveId: userReceiveId,
      amount: amount?.value * 100,
      currency: amount?.currency.toUpperCase(),
      organizationId: organizationSellerId,
      orderId: order?.id,
      type: 'PAYPAL',
      token: reference,
      model: 'PRODUCT',
      email: findOneUser?.email,
      description: `Product shop userId: ${findOneUser?.id}`,
      amountConvert: amountValueConvert * 100,
    });

    if (transaction?.token) {
      await this.walletsService.incrementOne({
        amount: transaction?.amountConvert,
        organizationId: transaction?.organizationId,
      });
    }

    return reply({ res, results: reference });
  }

  /** Create Shop */
  @Post(`/stripe/shop`)
  async createOneStripeShop(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const {
      amount,
      organizationSellerId,
      userReceiveId,
      userSendId,
      reference,
      cartOrderId,
      card,
      userAddress,
    } = body;
    const findOneUser = await this.usersService.findOneBy({
      userId: userSendId,
    });
    if (!findOneUser) {
      throw new HttpException(
        `This user ${userSendId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      card,
      currency: amount?.currency.toUpperCase(),
      amountDetail: amount,
      token: reference,
      description: `Product shop userId: ${findOneUser?.id}`,
    });
    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (paymentIntents) {
      const { order } = await this.ordersUtil.orderShopCreate({
        organizationBuyerId: findOneUser?.organizationId,
        userBeyerId: userSendId,
        cartOrderId,
        organizationSellerId,
        userAddress,
      });
      const transaction = await this.transactionsService.createOne({
        userSendId: findOneUser?.id,
        userReceiveId: userReceiveId,
        amount: Number(paymentIntents?.amount_received),
        currency: paymentIntents?.currency.toUpperCase(),
        organizationId: organizationSellerId,
        orderId: order?.id,
        type: 'CARD',
        token: reference,
        model: 'PRODUCT',
        email: findOneUser?.email,
        fullName: `${findOneUser?.profile?.firstName} ${findOneUser?.profile?.lastName}`,
        description: `Product shop userId: ${findOneUser?.id}`,
        amountConvert: amountValueConvert * 100,
      });

      if (transaction?.token) {
        await this.walletsService.incrementOne({
          amount: transaction?.amountConvert,
          organizationId: transaction?.organizationId,
        });
      }
    }

    return reply({ res, results: reference });
  }

  /** Create Commission */
  @Post(`/stripe/commission`)
  async createOneCommission(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const {
      amount,
      organizationSellerId,
      organizationBuyerId,
      userAddress,
      commissionId,
      userReceiveId,
      userSendId,
      reference,
      card,
    } = body;

    const findOneCommission = await this.commissionsService.findOneBy({
      commissionId: commissionId,
      organizationId: organizationSellerId,
    });
    if (!findOneCommission) {
      throw new HttpException(
        `This commission ${commissionId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      card,
      currency: amount?.currency.toUpperCase(),
      amountDetail: amount,
      token: reference,
      description: `Commission ${findOneCommission?.title}`,
    });
    if (!paymentIntents) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (paymentIntents) {
      const { order } = await this.ordersUtil.orderCommissionCreate({
        amount,
        userAddress,
        organizationBuyerId,
        organizationSellerId,
        userBeyerId: userSendId,
        commissionId: findOneCommission?.id,
      });
      const transaction = await this.transactionsService.createOne({
        userSendId,
        userReceiveId: userReceiveId,
        amount: Number(paymentIntents?.amount_received),
        currency: paymentIntents?.currency?.toUpperCase(),
        organizationId: organizationSellerId,
        orderId: order?.id,
        type: 'CARD',
        token: reference,
        model: 'COMMISSION',
        description: paymentIntents?.description,
        amountConvert: amountValueConvert * 100,
      });

      if (transaction?.token) {
        await this.walletsService.incrementOne({
          amount: transaction?.amountConvert,
          organizationId: transaction?.organizationId,
        });
      }
    }

    return reply({ res, results: reference });
  }

  @Post(`/paypal/commission`)
  async createOnePayPalCommission(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const {
      amount,
      organizationSellerId,
      organizationBuyerId,
      userAddress,
      commissionId,
      userReceiveId,
      userSendId,
      reference,
    } = body;
    const findOneCommission = await this.commissionsService.findOneBy({
      userId: commissionId,
      organizationId: organizationSellerId,
    });
    if (!findOneCommission) {
      throw new HttpException(
        `This commission ${commissionId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { order } = await this.ordersUtil.orderCommissionCreate({
      amount,
      userAddress,
      organizationBuyerId,
      organizationSellerId,
      userBeyerId: userSendId,
      commissionId: findOneCommission?.id,
    });

    const transaction = await this.transactionsService.createOne({
      userSendId,
      userReceiveId,
      currency: amount?.currency.toUpperCase(),
      amount: Number(amount?.value) * 100,
      organizationId: organizationSellerId,
      orderId: order?.id,
      type: 'PAYPAL',
      token: reference,
      model: 'COMMISSION',
      description: `Commission ${findOneCommission?.title}`,
      amountConvert: amountValueConvert * 100,
    });

    if (transaction?.token) {
      await this.walletsService.incrementOne({
        amount: transaction?.amountConvert,
        organizationId: transaction?.organizationId,
      });
    }

    return reply({ res, results: reference });
  }
}
