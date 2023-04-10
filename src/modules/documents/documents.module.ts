import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../models/Document';
import { SubProject } from '../../models/SubProject';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { SubProjectsService } from '../sub-projects/sub-projects.service';
import { Project } from '../../models/Project';
import { ProjectsService } from '../projects/projects.service';
import { ContributorsService } from '../contributors/contributors.service';
import { Contributor } from '../../models/Contributor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, SubProject, Project, Contributor]),
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    SubProjectsService,
    ProjectsService,
    ContributorsService,
  ],
})
export class DocumentsModule {}
