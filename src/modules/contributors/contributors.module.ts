import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor } from '../../models/Contributor';
import { OrganizationsService } from '../organizations/organizations.service';
import { ContributorsService } from './contributors.service';
import { ContributorsUtil } from './contributors.util';
import { Organization } from '../../models/Organization';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor, Organization])],
  controllers: [],
  providers: [ContributorsService, ContributorsUtil, OrganizationsService],
})
export class ContributorsModule {}
