import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from '../../models';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { UploadsUtil } from './uploads.util';

@Module({
  imports: [TypeOrmModule.forFeature([Upload])],
  controllers: [UploadsController],
  providers: [UploadsService, UploadsUtil],
})
export class UploadsModule {}
