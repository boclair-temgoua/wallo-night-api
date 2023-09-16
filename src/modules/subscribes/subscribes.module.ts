import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe, Follow, Membership, Transaction } from '../../models';
import { SubscribesController } from './subscribes.controller';
import { SubscribesService } from './subscribes.service';
import { FollowsService } from '../follows/follows.service';
import { MembershipsService } from '../memberships/memberships.service';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscribe, Follow, Membership, Transaction]),
  ],
  controllers: [SubscribesController],
  providers: [
    SubscribesService,
    FollowsService,
    MembershipsService,
    TransactionsService,
  ],
})
export class SubscribesModule {}
