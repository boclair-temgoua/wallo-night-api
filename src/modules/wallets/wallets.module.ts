import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../models/Wallet';
import { WalletsService } from './wallets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [],
  providers: [WalletsService],
})
export class WalletsModule {}
