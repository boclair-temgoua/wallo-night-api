import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from '../../models/Membership';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { Currency } from '../../models/Currency';
import { UploadsUtil } from '../uploads/uploads.util';
import { UploadsService } from '../uploads/uploads.service';
import { Upload } from '../../models/Upload';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, Currency,Upload])],
  controllers: [MembershipsController],
  providers: [MembershipsService, CurrenciesService,UploadsUtil,UploadsService],
})
export class MembershipsModule {}
