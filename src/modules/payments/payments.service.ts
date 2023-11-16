import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { config } from '../../app/config/index';
import { AmountModel } from '../wallets/wallets.type';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { useCatch } from 'src/app/utils/use-catch';
import { Payment } from '../../models';
import {
  CreatePaymentsOptions,
  GetOnePaymentsSelections,
  GetPaymentsSelections,
  UpdatePaymentsOptions,
  UpdatePaymentsSelections,
} from './payments.type';
import { CartsService } from '../cats/cats.service';

const apiVersion = '2023-10-16';
const stripePrivate = new Stripe(
  String(config.implementations.stripe.privateKey),
  {
    apiVersion,
  },
);

const stripePublic = new Stripe(
  String(config.implementations.stripe.publicKey),
  {
    apiVersion,
  },
);

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private driver: Repository<Payment>,
    private readonly cartsService: CartsService,
  ) {}

  async findAll(selections: GetPaymentsSelections): Promise<any> {
    const { search, pagination, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('payment')
      .select('payment.id', 'id')
      .addSelect('payment.phone', 'phone')
      .addSelect('payment.fullName', 'fullName')
      .addSelect('payment.email', 'email')
      .addSelect('payment.status', 'status')
      .addSelect('payment.action', 'action')
      .addSelect('payment.cardNumber', 'cardNumber')
      .addSelect('payment.type', 'type')
      .addSelect('payment.cardExpYear', 'cardExpYear')
      .addSelect('payment.organizationId', 'organizationId')
      .where('payment.deletedAt IS NULL');

    if (userId) {
      query = query.andWhere('payment.userId = :userId', {
        userId,
      });
    }

    if (organizationId) {
      query = query.andWhere('payment.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, payments] = await useCatch(
      query
        .orderBy('payment.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: payments,
    });
  }

  async findOneBy(selections: GetOnePaymentsSelections): Promise<Payment> {
    const { organizationId, paymentId, cardNumber, phone } = selections;
    let query = this.driver
      .createQueryBuilder('payment')
      .where('payment.deletedAt IS NULL');

    if (paymentId) {
      query = query.andWhere('payment.id = :id', { id: paymentId });
    }

    if (cardNumber) {
      query = query.andWhere('payment.cardNumber = :cardNumber', {
        cardNumber,
      });
    }

    if (organizationId) {
      query = query.andWhere('payment.organizationId = :organizationId', {
        organizationId,
      });
    }

    const result = await query.getOne();

    return result;
  }

  /** Create one Payment to the database. */
  async createOne(options: CreatePaymentsOptions): Promise<Payment> {
    const {
      action,
      email,
      fullName,
      phone,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      type,
      description,
      userId,
      organizationId,
    } = options;

    const payment = new Payment();
    payment.email = email;
    payment.fullName = fullName;
    payment.phone = phone;
    payment.cardNumber = cardNumber.split(' ').join('');
    payment.cardExpMonth = cardExpMonth;
    payment.cardExpYear = cardExpYear;
    payment.cardCvc = cardCvc;
    payment.type = type;
    payment.action = action;
    payment.description = description;
    payment.userId = userId;
    payment.organizationId = organizationId;

    const query = this.driver.save(payment);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Payment to the database. */
  async updateOne(
    selections: UpdatePaymentsSelections,
    options: UpdatePaymentsOptions,
  ): Promise<Payment> {
    const { paymentId } = selections;
    const {
      email,
      action,
      phone,
      fullName,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      type,
      description,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('payment');

    if (paymentId) {
      findQuery = findQuery.where('payment.id = :id', { id: paymentId });
    }

    const [errorFind, payment] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    payment.email = email;
    payment.phone = phone;
    payment.fullName = fullName;
    payment.cardNumber = cardNumber;
    payment.cardExpMonth = cardExpMonth;
    payment.cardExpYear = cardExpYear;
    payment.cardCvc = cardCvc;
    payment.type = type;
    payment.action = action;
    payment.description = description;
    payment.deletedAt = deletedAt;

    const query = this.driver.save(payment);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

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

    const paymentMethod = await stripePublic.tokens.create({
      card: {
        number: cardNumber.split(' ').join(''),
        exp_month: Number(cardExpMonth),
        exp_year: Number(cardExpYear),
        cvc: cardCvc,
      } as any,
    });

    const params: Stripe.CustomerCreateParams = {
      name: name,
      email: email,
      source: paymentMethod?.id,
    };
    const card: Stripe.Customer = await stripePrivate.customers.create(params);
    if (!paymentMethod && !card) {
      throw new HttpException(
        `Transaction not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    return { paymentMethod };
  }

  /** Stripe billing */
  async stripeMethod(options: {
    description?: string;
    amountDetail: AmountModel;
    token: string;
    currency: string;
    paymentMethod: any;
  }): Promise<any> {
    const { token, description, amountDetail, currency, paymentMethod } =
      options;

    const params: Stripe.CustomerCreateParams = {
      description: description,
      email: paymentMethod?.billing_details?.email,
      name: paymentMethod?.billing_details?.name,
    };
    const customer: Stripe.Customer =
      await stripePrivate.customers.create(params);
    const paymentIntents = await stripePrivate.paymentIntents.create({
      amount: Number(amountDetail?.value) * 100, // 25
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

  /** Cart execution */
  async cartExecution(options: {
    cartOrderId: string;
    userSendId: string;
    organizationId: string;
  }): Promise<any> {
    const { cartOrderId, userSendId, organizationId } = options;

    const { summary, cartItems } = await this.cartsService.findAll({
      userId: userSendId,
      status: 'ADDED',
      cartOrderId,
    });

    if (!summary && cartItems) {
      throw new HttpException(
        `Cart not found please try again`,
        HttpStatus.NOT_FOUND,
      );
    }

    return { summary, cartItems };
  }
}
