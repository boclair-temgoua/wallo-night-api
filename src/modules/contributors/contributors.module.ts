import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../models/Contributor';
import { OrganizationsService } from '../organizations/organizations.service';
import { ContributorsService } from './contributors.service';
import { ContributorsUtil } from './contributors.util';
import { Organization } from '../../models/Organization';
import { UsersService } from '../users/users.service';
import { User } from '../../models/User';
import { ProfilesService } from '../profiles/profiles.service';
import { Profile } from '../../models/Profile';
import { CheckUserService } from '../users/middleware/check-user.service';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../../models/Project';
import { ContributorsController } from './contributors.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contributor,
      Organization,
      User,
      Project,
      Profile,
    ]),
  ],
  controllers: [ContributorsController],
  providers: [
    ContributorsService,
    ContributorsUtil,
    OrganizationsService,
    UsersService,
    CheckUserService,
    ProfilesService,
    ProjectsService,
  ],
})
export class ContributorsModule {}
