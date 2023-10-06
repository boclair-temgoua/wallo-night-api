import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization, Contributor } from '../../models';
import { ContributorsService } from '../contributors/contributors.service';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Contributor])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, ContributorsService],
})
export class OrganizationsModule {}
