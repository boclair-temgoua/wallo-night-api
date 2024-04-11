import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  addMonthsFormateDDMMYYDate,
  dateTimeNowUtc,
  formateNowDateUnixInteger,
} from '../../app/utils/formate-date';
import { FilterQueryType } from '../../app/utils/search-query';
import { FollowsService } from '../follows/follows.service';
import { MembershipsService } from '../memberships/memberships.service';
import { OrdersUtil } from '../orders/orders.util';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/transactions.type';
import { AmountModel } from '../wallets/wallets.type';
import { SubscribesService } from './subscribes.service';

@Injectable()
export class SubscribesUtil {
  constructor(
    private readonly ordersUtil: OrdersUtil,
    private readonly followsService: FollowsService,
    private readonly subscribesService: SubscribesService,
    private readonly membershipsService: MembershipsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createOrUpdateOneSubscribe(options: {
    amount: AmountModel;
    userBuyerId: string;
    userReceiveId: string;
    type?: TransactionType;
    model: FilterQueryType;
    membershipId: string;
    description: string;
    token: string;
    amountValueConvert: number;
    organizationBuyerId: string;
    organizationSellerId: string;
    userAddress: any;
  }): Promise<any> {
    const {
      membershipId,
      amountValueConvert,
      description,
      type,
      userBuyerId,
      userReceiveId,
      amount,
      model,
      token,
      userAddress,
      organizationBuyerId,
      organizationSellerId,
    } = options;

    const findOneMembership = await this.membershipsService.findOneBy({
      membershipId,
    });
    if (!findOneMembership)
      throw new HttpException(
        `This membership ${membershipId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const findOneFollow = await this.followsService.findOneBy({
      followerId: findOneMembership?.userId,
      userId: userBuyerId,
    });
    const findOneSubscribe = await this.subscribesService.findOneBy({
      subscriberId: findOneMembership?.userId,
      userId: userBuyerId,
    });

    if (!findOneFollow) {
      await this.followsService.createOne({
        userId: userBuyerId,
        followerId: findOneMembership?.userId,
      });
    }

    if (findOneSubscribe) {
      const dateExpired = formateNowDateUnixInteger(
        findOneSubscribe?.expiredAt,
      );
      const dateNow = formateNowDateUnixInteger(dateTimeNowUtc());

      await this.subscribesService.updateOne(
        { subscribeId: findOneSubscribe?.id },
        {
          membershipId,
          userId: userBuyerId,
          organizationId: findOneMembership.organizationId,
          subscriberId: findOneMembership?.userId,
          expiredAt:
            dateExpired > dateNow
              ? addMonthsFormateDDMMYYDate({
                  date: findOneSubscribe?.expiredAt,
                  monthNumber: amount?.month,
                })
              : addMonthsFormateDDMMYYDate({
                  date: new Date(),
                  monthNumber: amount?.month,
                }),
        },
      );

      const { transaction } = await this.createTransactionAndOrder({
        amount,
        userBuyerId,
        userReceiveId,
        type,
        model: model,
        membershipId: findOneMembership?.id,
        description,
        token: token,
        amountValueConvert,
        organizationId: findOneMembership?.organizationId,
        subscribeId: findOneSubscribe?.id,
        organizationBuyerId,
        organizationSellerId,
        userAddress,
      });

      return { transaction };
    } else {
      const subscribe = await this.subscribesService.createOne({
        membershipId,
        userId: userBuyerId,
        organizationId: findOneMembership.organizationId,
        subscriberId: findOneMembership?.userId,
        expiredAt: addMonthsFormateDDMMYYDate({
          date: dateTimeNowUtc(),
          monthNumber: amount?.month,
        }),
      });

      const { transaction } = await this.createTransactionAndOrder({
        amount,
        userBuyerId,
        userReceiveId,
        type,
        model: model,
        membershipId,
        description,
        token: token,
        amountValueConvert,
        organizationId: findOneMembership?.organizationId,
        subscribeId: subscribe?.id,
        organizationBuyerId,
        organizationSellerId,
        userAddress,
      });

      return { transaction };
    }
  }

  async createTransactionAndOrder(options: {
    amount: AmountModel;
    userBuyerId: string;
    userReceiveId: string;
    type?: TransactionType;
    model: FilterQueryType;
    membershipId: string;
    description: string;
    token: string;
    amountValueConvert: number;
    organizationId: string;
    subscribeId: string;
    organizationBuyerId: string;
    organizationSellerId: string;
    userAddress: any;
  }): Promise<any> {
    const {
      membershipId,
      description,
      type,
      userBuyerId,
      userReceiveId,
      amount,
      model,
      token,
      userAddress,
      organizationId,
      subscribeId,
      amountValueConvert,
      organizationBuyerId,
      organizationSellerId,
    } = options;

    const { order } = await this.ordersUtil.orderCommissionOrMembershipCreate({
      amount,
      userAddress,
      model: 'MEMBERSHIP',
      organizationBuyerId,
      organizationSellerId,
      userBuyerId,
      membershipId,
    });

    const transaction = await this.transactionsService.createOne({
      type,
      model,
      token,
      currency: amount?.currency,
      userBuyerId,
      userReceiveId,
      organizationId,
      subscribeId,
      orderId: order?.id,
      amount: amount?.value,
      amountConvert: amountValueConvert,
      description,
    });

    return { transaction, order };
  }
}
