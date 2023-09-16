import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Profile,
  ResetPassword,
  Contributor,
  Wallet,
  Subscribe,
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Profile,
      Subscribe,
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
    JwtAuthStrategy,
    ContributorsUtil,
    SubscribesService,
    ContributorsService,
    ResetPasswordsService,
  ],
})
export class UsersModule {}
