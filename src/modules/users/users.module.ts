import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProfilesService } from '../profiles/profiles.service';
import { AuthUserController } from './auth/auth-user.controller';
import { UsersService } from './users.service';
import { Profile } from '../../models/Profile';
import { Organization } from '../../models/Organization';
import { ContributorsService } from '../contributors/contributors.service';
import { Contributor } from '../../models/Contributor';
import { CheckUserService } from './middleware/check-user.service';
import { UsersInternalController } from './user/users.internal.controller';
import { JwtAuthStrategy } from './middleware';
import { ContributorsUtil } from '../contributors/contributors.util';
import { ResetPasswordsService } from '../reset-passwords/reset-passwords.service';
import { ResetPassword } from '../../models/ResetPassword';
import { AuthTokenMiddleware } from './middleware/auth-token.middleware';
import { UsersExternalController } from './user/users.external.controller';
import { Application } from '../../models/Application';
import { ApplicationsService } from '../applications/applications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Application,
      Profile,
      Organization,
      Contributor,
      ResetPassword,
    ]),
  ],
  controllers: [
    AuthUserController,
    UsersInternalController,
    UsersExternalController,
  ],
  providers: [
    UsersService,
    ProfilesService,
    CheckUserService,
    JwtAuthStrategy,
    OrganizationsService,
    ContributorsService,
    ResetPasswordsService,
    ApplicationsService,
    ContributorsUtil,
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthTokenMiddleware).forRoutes(UsersExternalController);
  }
}
