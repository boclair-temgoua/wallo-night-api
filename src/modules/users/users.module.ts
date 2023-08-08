import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Profile,
  ResetPassword,
  Contributor,
  Wallet,
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Wallet,
      Profile,
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
    ContributorsService,
    ResetPasswordsService,
  ],
})
export class UsersModule {}
