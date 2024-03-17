import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Contributor,
  Currency,
  Donation,
  Organization,
  Profile,
  Provider,
  Subscribe,
  Upload,
  User,
  UserAddress,
  Wallet,
} from '../../models';
import { ContributorsService } from '../contributors/contributors.service';
import { ContributorsUtil } from '../contributors/contributors.util';
import { CurrenciesService } from '../currencies/currencies.service';
import { DonationsService } from '../donations/donations.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ProvidersService } from '../providers/providers.service';
import { SubscribesService } from '../subscribes/subscribes.service';
import { UploadsService } from '../uploads/uploads.service';
import { UploadsUtil } from '../uploads/uploads.util';
import { UserAddressService } from '../user-address/user-address.service';
import { WalletsService } from '../wallets/wallets.service';
import { AuthUserController } from './auth/auth-user.controller';
import { SocialUserController } from './auth/social-user.controller';
import { MailerService } from './mailer.service';
import { CheckUserService } from './middleware/check-user.service';
import { UserAuthStrategy } from './middleware/cookie/user-auth.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersUtil } from './users.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Profile,
      Subscribe,
      Currency,
      Donation,
      UserAddress,
      Organization,
      Contributor,
      Upload,
      Provider,
    ]),
  ],
  controllers: [AuthUserController, UsersController, SocialUserController],
  providers: [
    UsersUtil,
    UsersService,
    WalletsService,
    ProfilesService,
    CheckUserService,
    UserAuthStrategy,
    DonationsService,
    ContributorsUtil,
    CurrenciesService,
    SubscribesService,
    MailerService,
    UploadsUtil,
    UploadsService,
    UserAddressService,
    ProvidersService,
    ContributorsService,
    OrganizationsService,
  ],
})
export class UsersModule {}
