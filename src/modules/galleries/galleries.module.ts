import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleriesController } from './galleries.controller';
import { GalleriesService } from './galleries.service';
import { Gallery } from '../../models';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery])],
  controllers: [GalleriesController],
  providers: [GalleriesService],
})
export class GalleriesModule {}
