import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSubProject } from '../../models/SubSubProject';
import { ContributorsService } from '../contributors/contributors.service';
import { SubSubProjectsController } from './sub-sub-projects.controller';
import { SubSubProjectsService } from './sub-sub-projects.service';
import { Contributor } from '../../models/Contributor';
import { ProjectsService } from '../projects/projects.service';
import { Project } from 'src/models/Project';
import { SubProject } from 'src/models/SubProject';
import { SubProjectsService } from '../sub-projects/sub-projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubSubProject, SubProject, Contributor, Project]),
  ],
  controllers: [SubSubProjectsController],
  providers: [
    SubSubProjectsService,
    ContributorsService,
    ProjectsService,
    SubProjectsService,
  ],
})
export class SubSubProjectsModule {}
