import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../models/Contributor';
import { Profile } from '../../models/Profile';
import { User } from '../../models/User';
import { ProfilesService } from '../profiles/profiles.service';
import { CheckUserService } from '../users/middleware/check-user.service';
import { UsersService } from '../users/users.service';
import { ContributorsController } from './contributors.controller';
import { ContributorsService } from './contributors.service';
import { ContributorsUtil } from './contributors.util';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor, User, Profile])],
  controllers: [ContributorsController],
  providers: [
    ContributorsService,
    ContributorsUtil,
    UsersService,
    CheckUserService,
    ProfilesService,
  ],
})
export class ContributorsModule {}
