import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSubProject } from '../../models/SubSubProject';
import { ContributorsService } from '../contributors/contributors.service';
import { SubSubSubProjectsController } from './sub-sub-sub-projects.controller';
import { SubSubSubProjectsService } from './sub-sub-sub-projects.service';
import { Contributor } from '../../models/Contributor';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../../models/Project';
import { SubProject } from '../../models/SubProject';
import { SubProjectsService } from '../sub-projects/sub-projects.service';
import { SubSubProjectsService } from '../sub-sub-projects/sub-sub-projects.service';
import { SubSubSubProject } from '../../models/SubSubSubProject';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubSubSubProject,
      SubSubProject,
      SubProject,
      Contributor,
      Project,
    ]),
  ],
  controllers: [SubSubSubProjectsController],
  providers: [
    SubSubSubProjectsService,
    SubSubProjectsService,
    ContributorsService,
    ProjectsService,
    SubProjectsService,
  ],
})
export class SubSubSubProjectsModule {}
