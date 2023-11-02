import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
  HttpException,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { PaymentsService } from './payments.service';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { WalletsService } from '../wallets/wallets.service';
import {
  CreateOnePaymentDto,
  CreateSubscribePaymentsDto,
} from './payments.dto';
import { TransactionsUtil } from '../transactions/transactions.util';
import { TransactionsService } from '../transactions/transactions.service';
import { CommentsService } from '../comments/comments.service';
import { JwtAuthGuard } from '../users/middleware';
import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { FilterTransactionsDto } from '../transactions/transactions.dto';
import { PaginationType, addPagination } from '../../app/utils/pagination';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly walletsService: WalletsService,
    private readonly transactionsUtil: TransactionsUtil,
    private readonly subscribesUtil: SubscribesUtil,
    private readonly commentsService: CommentsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  /** Get all Payments */
  @Get(`/`)
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { user } = req;
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const payments = await this.paymentsService.findAll({
      search,
      pagination,
      organizationId: user.organizationId,
    });

    return reply({ res, results: payments });
  }

  /** Create one payment */
  @Post(`/create`)
  @UseGuards(JwtAuthGuard)
  async createOne(@Res() res, @Req() req, @Body() body: CreateOnePaymentDto) {
    const { user } = req;
    const {
      email,
      phone,
      fullName,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      type,
      description,
    } = body;

    if (type === 'CARD') {
      const findOnePayment = await this.paymentsService.findOneBy({
        cardNumber,
        organizationId: user?.organizationId,
      });
      if (findOnePayment)
        throw new HttpException(
          `Card ${cardNumber} already exists please change`,
          HttpStatus.NOT_FOUND,
        );

      await this.paymentsService.stripeTokenCreate({
        name: fullName,
        email,
        cardNumber,
        cardExpMonth,
        cardExpYear,
        cardCvc,
      });
    }

    if (type === 'PHONE') {
      const findOnePayment = await this.paymentsService.findOneBy({
        phone,
        organizationId: user?.organizationId,
      });
      if (findOnePayment)
        throw new HttpException(
          `Phone ${phone} already exists please change`,
          HttpStatus.NOT_FOUND,
        );
    }

    await this.paymentsService.createOne({
      email,
      phone,
      fullName,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      type,
      action: type === 'PHONE' ? 'WITHDRAWING' : 'PAYMENT',
      description,
      userId: user?.id,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: 'payment created successfully' });
  }

  /** Create subscribe */
  @Post(`/paypal/subscribe`)
  async createOnePaypalSubscribe(
    @Res() res,
    @Req() req,
    @Body() body: CreateSubscribePaymentsDto,
  ) {
    const {
      amount,
      membershipId,
      userReceiveId,
      userSendId,
      reference,
      paymentMethod,
    } = body;

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
    const {
      amount,
      membershipId,
      userReceiveId,
      userSendId,
      reference,
      paymentMethod,
    } = body;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      paymentMethod,
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
      organizationId,
      userReceiveId,
      userSendId,
      reference,
      paymentMethod,
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
      organizationId: organizationId,
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
      organizationId,
      userReceiveId,
      userSendId,
      reference,
      paymentMethod,
    } = body;
    const { billing_details } = paymentMethod;

    const { value: amountValueConvert } =
      await this.transactionsUtil.convertedValue({
        currency: amount?.currency,
        value: amount?.value,
      });

    const { paymentIntents } = await this.paymentsService.stripeMethod({
      paymentMethod,
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
        organizationId: organizationId,
        type: 'CARD',
        token: reference,
        model: 'DONATION',
        email: billing_details?.email,
        fullName: billing_details?.name ?? 'Somebody',
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
        });
      }
    }

    return reply({ res, results: reference });
  }
}
