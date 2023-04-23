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
import { ResetPasswordsModule } from './modules/reset-passwords/reset-passwords.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SubProjectsModule } from './modules/sub-projects/sub-projects.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { SubSubProjectsModule } from './modules/sub-sub-projects/sub-sub-projects.module';
import { SubSubSubProjectsModule } from './modules/sub-sub-sub-projects/sub-sub-sub-projects.module';
import { ContactProjectsModule } from './modules/contact-projects/contact-projects.module';
import { GroupsModule } from './modules/groups/groups.module';

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
    ProjectsModule,
    DocumentsModule,
    SubProjectsModule,
    UserAddressModule,
    ContributorsModule,
    ApplicationsModule,
    ContactsModule,
    GroupsModule,
    CategoriesModule,
    SubSubProjectsModule,
    ContactProjectsModule,
    SubSubSubProjectsModule,
    ResetPasswordsModule,
    ContactUsModule,
  ],
})
export class AppModule {}
