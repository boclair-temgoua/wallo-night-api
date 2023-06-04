import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../../models/Organization';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { Contributor } from '../../models/Contributor';
import { ContributorsService } from '../contributors/contributors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Contributor])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, ContributorsService],
})
export class OrganizationsModule {}
