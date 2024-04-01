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
import { OrdersUtil } from '../orders/orders.util';
import { ProductsService } from '../products/products.service';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsUtil } from '../transactions/transactions.util';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateSubscribePaymentsDto } from './payments.dto';
import { PaymentsService } from './payments.service';
import { PaymentsUtil } from './payments.util';

@Controller('payments')
export class PaymentsTransactionController {
  constructor(
    private readonly paymentsUtil: PaymentsUtil,
    private readonly paymentsService: PaymentsService,
    private readonly productsService: ProductsService,
    private readonly walletsService: WalletsService,
    private readonly transactionsUtil: TransactionsUtil,
    private readonly subscribesUtil: SubscribesUtil,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
    private readonly ordersUtil: OrdersUtil,
    private readonly transactionsService: TransactionsService,
  ) {}

  /** Create subscribe */
  @Post(`/paypal/subscribe`)
  async createOnePaypalSubscribe(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const { amount, membershipId, userReceiveId, userBuyerId, reference } =
      body;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { transaction } =
      await this.subscribesUtil.createOrUpdateOneSubscribe({
        userBuyerId: userBuyerId,
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
    const {
      amount,
      membershipId,
      userReceiveId,
      userBuyerId,
      reference,
      organizationBuyerId,
      card,
    } = body;

    await this.paymentsUtil.paymentsTransactionStripe({
      amount,
      reference,
      userBuyerId,
      card,
      organizationBuyerId,
      userReceiveId,
      membershipId,
    });

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
      organizationSellerId,
      userReceiveId,
      userBuyerId,
      reference,
    } = body;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const transaction = await this.transactionsService.createOne({
      userBuyerId: userBuyerId,
      userReceiveId: userReceiveId,
      amount: amount?.value * 100,
      currency: amount?.currency.toUpperCase(),
      organizationId: organizationSellerId,
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
        userId: transaction?.userBuyerId,
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
      organizationSellerId,
      organizationBuyerId,
      userReceiveId,
      userBuyerId,
      reference,
      card,
    } = body;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsUtil.stripeMethod({
      card,
      currency: amount?.currency.toUpperCase(),
      amountDetail: amount,
      token: reference,
      userBuyerId,
      organizationBuyerId,
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
        userBuyerId: userBuyerId,
        userReceiveId: userReceiveId,
        amount: amount?.value * 100,
        currency: paymentIntents?.currency.toUpperCase(),
        organizationId: organizationSellerId,
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
          userId: transaction?.userBuyerId,
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
      userBuyerId,
      reference,
      cartOrderId,
      userAddress,
    } = body;
    const findOneUser = await this.usersService.findOneBy({
      userId: userBuyerId,
    });
    if (!findOneUser) {
      throw new HttpException(
        `This user ${userBuyerId} dons't exist please change`,
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
      userBuyerId: userBuyerId,
      cartOrderId,
      organizationSellerId,
      userAddress,
    });

    const transaction = await this.transactionsService.createOne({
      userBuyerId: findOneUser?.id,
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
      userBuyerId,
      reference,
      cartOrderId,
      card,
      userAddress,
    } = body;
    const findOneUser = await this.usersService.findOneBy({
      userId: userBuyerId,
    });
    if (!findOneUser) {
      throw new HttpException(
        `This user ${userBuyerId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsUtil.stripeMethod({
      card,
      currency: amount?.currency.toUpperCase(),
      amountDetail: amount,
      token: reference,
      userBuyerId,
      organizationBuyerId: findOneUser?.organizationId,
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
        userBuyerId: userBuyerId,
        cartOrderId,
        organizationSellerId,
        userAddress,
      });
      const transaction = await this.transactionsService.createOne({
        userBuyerId: findOneUser?.id,
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
      productId,
      userReceiveId,
      userBuyerId,
      reference,
      card,
    } = body;

    const findOneProduct = await this.productsService.findOneBy({
      productId: productId,
      organizationId: organizationSellerId,
    });
    if (!findOneProduct) {
      throw new HttpException(
        `This product ${productId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );
    }

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsUtil.stripeMethod({
      card,
      currency: amount?.currency.toUpperCase(),
      amountDetail: amount,
      token: reference,
      userBuyerId,
      organizationBuyerId,
      description: `Commission ${findOneProduct?.title}`,
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
        userBuyerId: userBuyerId,
        productId: findOneProduct?.id,
      });
      const transaction = await this.transactionsService.createOne({
        userBuyerId,
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

    // send email to buyer
    // await orderCommissionJob({ email: findOneUser?.email, token: '' });

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
      productId,
      userReceiveId,
      userBuyerId,
      reference,
    } = body;
    const findOneProduct = await this.productsService.findOneBy({
      productId: productId,
      organizationId: organizationSellerId,
    });
    if (!findOneProduct) {
      throw new HttpException(
        `This product ${productId} dons't exist please change`,
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
      userBuyerId: userBuyerId,
      productId: findOneProduct?.id,
    });

    const transaction = await this.transactionsService.createOne({
      userBuyerId,
      userReceiveId,
      currency: amount?.currency.toUpperCase(),
      amount: Number(amount?.value) * 100,
      organizationId: organizationSellerId,
      orderId: order?.id,
      type: 'PAYPAL',
      token: reference,
      model: 'COMMISSION',
      description: `Commission ${findOneProduct?.title}`,
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
