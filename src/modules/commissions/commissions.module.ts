import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission, Upload } from '../../models';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';

@Module({
  imports: [TypeOrmModule.forFeature([Commission, Upload])],
  controllers: [CommissionsController],
  providers: [CommissionsService, UploadsService, UploadsUtil],
})
export class CommissionsModule {}
