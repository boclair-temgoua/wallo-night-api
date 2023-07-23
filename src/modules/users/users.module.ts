import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Profile,
  ResetPassword,
  Organization,
  Contributor,
} from '../../models';
import { ProfilesService } from '../profiles/profiles.service';
import { AuthUserController } from './auth/auth-user.controller';
import { UsersService } from './users.service';
import { CheckUserService } from './middleware/check-user.service';
import { UsersController } from './users.controller';
import { JwtAuthStrategy } from './middleware';
import { ResetPasswordsService } from '../reset-passwords/reset-passwords.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { ContributorsUtil } from '../contributors/contributors.util';
import { ContributorsService } from '../contributors/contributors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      ResetPassword,
      Organization,
      Contributor,
    ]),
  ],
  controllers: [AuthUserController, UsersController],
  providers: [
    UsersService,
    ProfilesService,
    CheckUserService,
    JwtAuthStrategy,
    ContributorsUtil,
    ContributorsService,
    OrganizationsService,
    ResetPasswordsService,
  ],
})
export class UsersModule {}
