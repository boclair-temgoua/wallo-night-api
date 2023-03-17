import { ProfilesModule } from './modules/profiles/profiles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppDataSource } from './app/databases/config';
import { ConfigModule } from '@nestjs/config';
import { FaqsModule } from './modules/faqs/faqs.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { ContributorsModule } from './modules/contributors/contributors.module';
import { UserAddressModule } from './modules/user-address/user-address.module';
import { AppSeedDataSource } from './app/databases/config/orm-config-seed';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forRoot(AppSeedDataSource.options),
    ScheduleModule.forRoot(),
    FaqsModule,
    OrganizationsModule,
    ProfilesModule,
    UsersModule,
    UserAddressModule,
    ContributorsModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
