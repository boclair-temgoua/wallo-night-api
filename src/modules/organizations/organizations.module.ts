import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor, Organization, User } from '../../models';
import { ContributorsService } from '../contributors/contributors.service';
import { UsersService } from '../users/users.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Contributor, User])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, ContributorsService, UsersService],
})
export class OrganizationsModule {}
