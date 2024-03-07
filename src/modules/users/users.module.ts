import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Contributor,
  Organization,
  Profile,
  ResetPassword,
  User,
  Wallet,
} from '../../models';
import { ContributorsService } from '../contributors/contributors.service';
import { ContributorsUtil } from '../contributors/contributors.util';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ResetPasswordsService } from '../reset-passwords/reset-passwords.service';
import { WalletsService } from '../wallets/wallets.service';
import { AuthUserController } from './auth/auth-user.controller';
import { UserAuthStrategy } from './middleware';
import { CheckUserService } from './middleware/check-user.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Profile,
      Organization,
      ResetPassword,
      Contributor,
    ]),
  ],
  controllers: [AuthUserController, UsersController],
  providers: [
    UsersService,
    WalletsService,
    ProfilesService,
    CheckUserService,
    UserAuthStrategy,
    ContributorsUtil,
    OrganizationsService,
    ContributorsService,
    ResetPasswordsService,
  ],
})
export class UsersModule {}
