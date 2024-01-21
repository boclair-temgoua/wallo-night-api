import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Profile,
  ResetPassword,
  Contributor,
  Wallet,
  Organization,
  Currency,
  Subscribe,
  Donation,
  AuthProvider,
} from '../../models';
import { ProfilesService } from '../profiles/profiles.service';
import { AuthUserController } from './auth/auth-user.controller';
import { UsersService } from './users.service';
import { CheckUserService } from './middleware/check-user.service';
import { UsersController } from './users.controller';
import { JwtAuthStrategy } from './middleware';
import { ResetPasswordsService } from '../reset-passwords/reset-passwords.service';
import { ContributorsUtil } from '../contributors/contributors.util';
import { ContributorsService } from '../contributors/contributors.service';
import { WalletsService } from '../wallets/wallets.service';
import { SubscribesService } from '../subscribes/subscribes.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { DonationsService } from '../donations/donations.service';
import { UsersUtil } from './users.util';
import { SocialUserController } from './auth/social-user.controller';
import { AuthProvidersService } from '../auth-providers/auth-providers.service';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Profile,
      Subscribe,
      Currency,
      Donation,
      Organization,
      ResetPassword,
      Contributor,
      AuthProvider,
    ]),
  ],
  controllers: [AuthUserController, UsersController, SocialUserController],
  providers: [
    UsersUtil,
    UsersService,
    WalletsService,
    ProfilesService,
    CheckUserService,
    JwtAuthStrategy,
    DonationsService,
    ContributorsUtil,
    CurrenciesService,
    SubscribesService,
    MailerService,
    AuthProvidersService,
    ContributorsService,
    OrganizationsService,
    ResetPasswordsService,
  ],
})
export class UsersModule {}
