import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OurEvent, Upload } from '../../models';
import { OurEventsController } from './our-events.controller';
import { OurEventsService } from './our-events.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';

@Module({
  imports: [TypeOrmModule.forFeature([OurEvent, Upload])],
  controllers: [OurEventsController],
  providers: [OurEventsService, UploadsService, UploadsUtil],
})
export class OurEventsModule {}
