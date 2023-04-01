import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../models/Contributor';
import { OrganizationsService } from '../organizations/organizations.service';
import { ContributorsService } from './contributors.service';
import { ContributorsUtil } from './contributors.util';
import { Organization } from '../../models/Organization';
import { ContributorsInternalController } from './controllers/contributors.internal.controller';
import { ContributorsExternalController } from './controllers/contributors.external.controller';
import { UsersService } from '../users/users.service';
import { User } from '../../models/User';
import { AuthTokenMiddleware } from '../users/middleware';
import { Application } from '../../models/Application';
import { ApplicationsService } from '../applications/applications.service';
import { ProfilesService } from '../profiles/profiles.service';
import { Profile } from '../../models/Profile';
import { CheckUserService } from '../users/middleware/check-user.service';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../../models/Project';
import { SubProjectsService } from '../sub-projects/sub-projects.service';
import { SubProject } from 'src/models/SubProject';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contributor,
      Organization,
      User,
      Project,
      SubProject,
      Application,
      Profile,
    ]),
  ],
  controllers: [ContributorsInternalController, ContributorsExternalController],
  providers: [
    ContributorsService,
    ContributorsUtil,
    OrganizationsService,
    UsersService,
    CheckUserService,
    ProfilesService,
    ProjectsService,
    SubProjectsService,
    ApplicationsService,
  ],
})
export class ContributorsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes(ContributorsExternalController);
  }
}
