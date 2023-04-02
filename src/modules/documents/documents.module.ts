import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../models/Document';
import { SubProject } from '../../models/SubProject';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { SubProjectsService } from '../sub-projects/sub-projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, SubProject])],
  controllers: [DocumentsController],
  providers: [DocumentsService, SubProjectsService],
})
export class DocumentsModule {}
