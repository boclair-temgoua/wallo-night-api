import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../models/Contributor';
import { OrganizationsService } from '../organizations/organizations.service';
import { ContributorsService } from './contributors.service';
import { ContributorsUtil } from './contributors.util';
import { Organization } from '../../models/Organization';
import { ContributorsController } from './contributors.controller';
import { UsersService } from '../users/users.service';
import { User } from '../../models/User';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor, Organization, User])],
  controllers: [ContributorsController],
  providers: [
    ContributorsService,
    ContributorsUtil,
    OrganizationsService,
    UsersService,
  ],
})
export class ContributorsModule {}
