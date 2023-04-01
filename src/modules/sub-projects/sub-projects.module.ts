import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubProject } from '../../models/SubProject';
import { ContributorsService } from '../contributors/contributors.service';
import { SubProjectsController } from './sub-projects.controller';
import { SubProjectsService } from './sub-projects.service';
import { Contributor } from '../../models/Contributor';
import { ProjectsService } from '../projects/projects.service';
import { Project } from 'src/models/Project';

@Module({
  imports: [TypeOrmModule.forFeature([SubProject, Contributor, Project])],
  controllers: [SubProjectsController],
  providers: [SubProjectsService, ContributorsService, ProjectsService],
})
export class SubProjectsModule {}
