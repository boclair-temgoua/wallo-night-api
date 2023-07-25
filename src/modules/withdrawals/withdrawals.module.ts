import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal, Wallet } from '../../models';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { WalletsService } from '../wallets/wallets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Withdrawal, Wallet])],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService, WalletsService],
})
export class WithdrawalsModule {}
