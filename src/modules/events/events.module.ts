import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, Upload } from '../../models';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Upload])],
  controllers: [EventsController],
  providers: [EventsService, UploadsService, UploadsUtil],
})
export class EventsModule {}
