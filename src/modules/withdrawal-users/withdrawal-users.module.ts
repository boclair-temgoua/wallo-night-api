import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalUser, Wallet } from '../../models';
import { WithdrawalUsersService } from './withdrawal-users.service';
import { WithdrawalUsersController } from './withdrawal-users.controller';
import { WalletsService } from '../wallets/wallets.service';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalUser, Wallet])],
  controllers: [WithdrawalUsersController],
  providers: [WithdrawalUsersService, WalletsService],
})
export class WithdrawalUsersModule {}
