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

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, ResetPassword])],
  controllers: [AuthUserController, UsersController],
  providers: [
    UsersService,
    ProfilesService,
    CheckUserService,
    JwtAuthStrategy,
    ResetPasswordsService,
  ],
})
export class UsersModule {}
