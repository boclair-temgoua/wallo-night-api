import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor, Organization, Profile, User } from '../../models';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CheckUserService } from '../users/middleware/check-user.service';
import { UsersService } from '../users/users.service';
import { ContributorsService } from './contributors.service';
import { ContributorsUtil } from './contributors.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contributor, User, Profile, Organization]),
  ],
  controllers: [],
  providers: [
    UsersService,
    CheckUserService,
    ProfilesService,
    ContributorsService,
    OrganizationsService,
    ContributorsUtil,
  ],
})
export class ContributorsModule {}
