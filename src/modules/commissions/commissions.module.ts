import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission, Upload } from '../../models';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Commission, Upload])],
  controllers: [CommissionsController],
  providers: [CommissionsService, UploadsService],
})
export class CommissionsModule {}
