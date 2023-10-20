import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/transactions.type';
import { FilterQueryType } from '../../app/utils/search-query';
import { OurEventsService } from './our-events.service';

@Injectable()
export class OurEventsUtil {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly ourEventsService: OurEventsService,
  ) {}

  async createOrUpdateOneSubscribe(options: {
    amount: { value: number; quantity: number };
    userId: string;
    currency: string;
    type?: TransactionType;
    model: FilterQueryType;
    description: string;
    token: string;
    eventId: string;
  }): Promise<any> {
    const {
      description,
      type,
      userId,
      amount,
      model,
      currency,
      token,
      eventId,
    } = options;

    const findOneOrEvent = await this.ourEventsService.findOneBy({
      eventId,
    });
    if (!findOneOrEvent)
      throw new HttpException(
        `This event ${eventId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    const transaction = await this.transactionsService.createOne({
      token: token,
      currency: currency,
      userId: userId,
      model: model,
      type,
      userSendId: userId,
      quantity: amount?.quantity,
      organizationId: findOneOrEvent?.organizationId,
      ourEventId: findOneOrEvent?.id,
      amount: amount?.value,
      description: description,
    });
    return { transaction };
  }
}
