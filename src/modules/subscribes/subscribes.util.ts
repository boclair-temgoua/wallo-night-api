import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MembershipsService } from '../memberships/memberships.service';
import { TransactionsService } from '../transactions/transactions.service';
import { SubscribesService } from './subscribes.service';
import {
  addMonthsFormateDDMMYYDate,
  formateNowDateUnixInteger,
} from '../../app/utils/commons/formate-date';
import { FollowsService } from '../follows/follows.service';
import { TransactionType } from '../transactions/transactions.type';
import { FilterQueryType } from '../../app/utils/search-query';
import { AmountModel } from '../wallets/wallets.type';
import { TransactionsUtil } from '../transactions/transactions.util';

@Injectable()
export class SubscribesUtil {
  constructor(
    private readonly transactionsUtil: TransactionsUtil,
    private readonly followsService: FollowsService,
    private readonly subscribesService: SubscribesService,
    private readonly membershipsService: MembershipsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createOrUpdateOneSubscribe(options: {
    amount: AmountModel;
    userId: string;
    type?: TransactionType;
    model: FilterQueryType;
    membershipId: string;
    description: string;
    token: string;
    amountValueConvert: number;
  }): Promise<any> {
    const {
      membershipId,
      amountValueConvert,
      description,
      type,
      userId,
      amount,
      model,
      token,
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
      userId: userId,
    });
    const findOneSubscribe = await this.subscribesService.findOneBy({
      subscriberId: findOneMembership?.userId,
      userId: userId,
    });

    if (!findOneFollow) {
      await this.followsService.createOne({
        userId: userId,
        followerId: findOneMembership?.userId,
      });
    }

    if (findOneSubscribe) {
      const dateExpired = formateNowDateUnixInteger(
        findOneSubscribe?.expiredAt,
      );
      const dateNow = formateNowDateUnixInteger(new Date());

      await this.subscribesService.updateOne(
        { subscribeId: findOneSubscribe?.id },
        {
          membershipId,
          userId: userId,
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

      const transaction = await this.transactionsService.createOne({
        token: token,
        currency: amount?.currency,
        model: model,
        userSendId: userId,
        subscribeId: findOneSubscribe?.id,
        amount: amount?.value,
        description: description,
        amountConvert: amountValueConvert,
        organizationId: findOneMembership?.organizationId,
      });

      return { transaction };
    } else {
      const subscribe = await this.subscribesService.createOne({
        membershipId,
        userId: userId,
        organizationId: findOneMembership.organizationId,
        subscriberId: findOneMembership?.userId,
        expiredAt: addMonthsFormateDDMMYYDate({
          date: new Date(),
          monthNumber: amount?.month,
        }),
      });

      const transaction = await this.transactionsService.createOne({
        type,
        model: model,
        token: token,
        currency: amount?.currency,
        userSendId: userId,
        organizationId: findOneMembership?.organizationId,
        subscribeId: subscribe?.id,
        amount: amount?.value,
        amountConvert: amountValueConvert,
        description: description,
      });
      return { transaction };
    }
  }
}
