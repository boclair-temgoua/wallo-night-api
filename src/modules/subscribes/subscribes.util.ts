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

@Injectable()
export class SubscribesUtil {
  constructor(
    private readonly followsService: FollowsService,
    private readonly subscribesService: SubscribesService,
    private readonly membershipsService: MembershipsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createOrUpdateOneSubscribe(options: {
    amount: { value: number; month: number };
    userId: string;
    currency: string;
    type?: TransactionType;
    model: FilterQueryType;
    membershipId: string;
    token: string;
  }): Promise<any> {
    const { membershipId, type, userId, amount, model, currency, token } =
      options;

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

      await this.transactionsService.createOne({
        token: token,
        currency: currency,
        userId: userId,
        model: model,
        userSendId: userId,
        userReceiveId: findOneMembership?.userId,
        subscribeId: findOneSubscribe?.id,
        amount: Number(amount?.value),
        description: 'subscribe',
      });
    } else {
      const subscribe = await this.subscribesService.createOne({
        membershipId,
        userId: userId,
        subscriberId: findOneMembership?.userId,
        expiredAt: addMonthsFormateDDMMYYDate({
          date: new Date(),
          monthNumber: amount?.month,
        }),
      });

      await this.transactionsService.createOne({
        type,
        model: model,
        token: token,
        currency: currency,
        userId: userId,
        userSendId: userId,
        userReceiveId: findOneMembership?.userId,
        subscribeId: subscribe?.id,
        amount: Number(amount?.value) * 100,
        description: 'subscribe',
      });
    }

    return 'ok';
  }
}
