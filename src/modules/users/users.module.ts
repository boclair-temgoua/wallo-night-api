import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProfilesService } from '../profiles/profiles.service';
import { AuthUserController } from './auth/auth-user.controller';
import { UsersService } from './users.service';
import { Profile } from '../../models/Profile';
import { Organization } from '../../models/Organization';
import { ContributorsService } from '../contributors/contributors.service';
import { Contributor } from '../../models/Contributor';
import { CheckUserService } from './middleware/check-user.service';
import { UsersController } from './user/users.controller';
import { JwtAuthAdminStrategy, JwtAuthStrategy } from './middleware';
import { ContributorsUtil } from '../contributors/contributors.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Organization, Contributor]),
  ],
  controllers: [AuthUserController, UsersController],
  providers: [
    UsersService,
    ProfilesService,
    CheckUserService,
    JwtAuthStrategy,
    JwtAuthAdminStrategy,
    OrganizationsService,
    ContributorsService,
    ContributorsUtil,
  ],
})
export class UsersModule {}
