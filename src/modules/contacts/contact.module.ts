import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact, Upload } from '../../models';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Upload])],
  controllers: [ContactController],
  providers: [ContactService, UploadsService, UploadsUtil],
})
export class ContactModule {}
