import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from '../../models/Currency';
import { Membership } from '../../models/Membership';
import { Upload } from '../../models/Upload';
import { CurrenciesService } from '../currencies/currencies.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, Currency, Upload])],
  controllers: [MembershipsController],
  providers: [
    MembershipsService,
    CurrenciesService,
    UploadsUtil,
    UploadsService,
  ],
})
export class MembershipsModule {}
