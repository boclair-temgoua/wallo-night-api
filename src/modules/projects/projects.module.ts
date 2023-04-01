import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../models/Project';
import { ContributorsService } from '../contributors/contributors.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Contributor } from '../../models/Contributor';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Contributor])],
  controllers: [ProjectsController],
  providers: [ProjectsService, ContributorsService],
})
export class ProjectsModule {}
