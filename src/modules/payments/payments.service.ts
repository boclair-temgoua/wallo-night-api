import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { useCatch } from 'src/app/utils/use-catch';
import { Repository } from 'typeorm';
import { withPagination } from '../../app/utils/pagination/with-pagination';
import { Payment } from '../../models';
import {
  CreatePaymentsOptions,
  GetOnePaymentsSelections,
  GetPaymentsSelections,
  UpdatePaymentsOptions,
  UpdatePaymentsSelections,
} from './payments.type';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private driver: Repository<Payment>,
  ) {}

  async findAll(selections: GetPaymentsSelections): Promise<any> {
    const { search, type, pagination, userId, organizationId } = selections;

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
      .addSelect('payment.brand', 'brand')
      .addSelect('payment.cardExpMonth', 'cardExpMonth')
      .addSelect('payment.cardExpYear', 'cardExpYear')
      .addSelect('payment.organizationId', 'organizationId')
      .where('payment.deletedAt IS NULL');

    if (type) {
      query = query.andWhere('payment.type = :type', {
        type,
      });
    }

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

    const payments = await query
      .orderBy('payment.createdAt', pagination?.sort)
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getRawMany();

    return withPagination({
      pagination,
      rowCount,
      value: payments,
    });
  }

  async findOneBy(selections: GetOnePaymentsSelections): Promise<Payment> {
    const {
      organizationId,
      paymentId,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      phone,
      status,
    } = selections;
    let query = this.driver
      .createQueryBuilder('payment')
      .where('payment.deletedAt IS NULL');

    if (paymentId) {
      query = query.andWhere('payment.id = :id', { id: paymentId });
    }

    if (status) {
      query = query.andWhere('payment.status = :status', { status });
    }

    if (phone) {
      query = query.andWhere('payment.phone = :phone', { phone });
    }

    if (cardExpMonth) {
      query = query.andWhere('payment.cardExpMonth = :cardExpMonth', {
        cardExpMonth,
      });
    }

    if (cardExpYear) {
      query = query.andWhere('payment.cardExpYear = :cardExpYear', {
        cardExpYear,
      });
    }

    if (cardCvc) {
      query = query.andWhere('payment.cardCvc = :cardCvc', {
        cardCvc,
      });
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
      brand,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      type,
      userId,
      organizationId,
    } = options;

    const payment = new Payment();
    payment.email = email;
    payment.fullName = fullName;
    payment.phone = phone;
    payment.cardNumber = cardNumber?.split(' ').join('');
    payment.cardExpMonth = cardExpMonth;
    payment.cardExpYear = cardExpYear;
    payment.cardCvc = cardCvc;
    payment.type = type;
    payment.brand = brand;
    payment.action = action;
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
      status,
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
    payment.status = status;
    payment.deletedAt = deletedAt;

    const query = this.driver.save(payment);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
