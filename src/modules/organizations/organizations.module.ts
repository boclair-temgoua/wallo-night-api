import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contributor, Organization } from '../../models';
import { ContributorsService } from '../contributors/contributors.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Contributor])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, ContributorsService],
})
export class OrganizationsModule {}
