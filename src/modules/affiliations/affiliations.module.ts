import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Affiliation,
  Contributor,
  Organization,
  Product,
  User,
} from '../../models';
import { ContributorsService } from '../contributors/contributors.service';
import { ContributorsUtil } from '../contributors/contributors.util';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { AffiliationsController } from './affiliations.controller';
import { AffiliationsService } from './affiliations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Affiliation,
      Product,
      User,
      Contributor,
      Organization,
    ]),
  ],
  controllers: [AffiliationsController],
  providers: [
    AffiliationsService,
    ProductsService,
    UsersService,
    ContributorsUtil,
    ContributorsService,
    OrganizationsService,
  ],
})
export class AffiliationsModule {}
