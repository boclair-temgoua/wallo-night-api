import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { ProfilesService } from '../profiles/profiles.service';
import { AuthUserController } from './auth/auth-user.controller';
import { UsersService } from './users.service';
import { Profile } from '../../models/Profile';
import { CheckUserService } from './middleware/check-user.service';
import { UsersController } from './users.controller';
import { JwtAuthStrategy } from './middleware';
import { ResetPasswordsService } from '../reset-passwords/reset-passwords.service';
import { ResetPassword } from '../../models/ResetPassword';
import { Organization } from '../../models/Organization';
import { OrganizationsService } from '../organizations/organizations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, ResetPassword, Organization]),
  ],
  controllers: [AuthUserController, UsersController],
  providers: [
    UsersService,
    ProfilesService,
    CheckUserService,
    JwtAuthStrategy,
    OrganizationsService,
    ResetPasswordsService,
  ],
})
export class UsersModule {}
