import { ProfilesModule } from './modules/profiles/profiles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppDataSource } from './app/databases/orm';
import { ConfigModule } from '@nestjs/config';
import { FaqsModule } from './modules/faqs/faqs.module';
import { UsersModule } from './modules/users/users.module';
import { AppSeedDataSource } from './app/databases/orm/orm-config-seed';
import { ResetPasswordsModule } from './modules/reset-passwords/reset-passwords.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContributorsModule } from './modules/contributors/contributors.module';
import { OurEventsModule } from './modules/our-events/our-events.module';
import { CountriesModule } from './modules/countries/countries.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrderEventsModule } from './modules/order-events/order-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forRoot(AppSeedDataSource.options),
    ScheduleModule.forRoot(),
    FaqsModule,
    ProfilesModule,
    UsersModule,
    ProjectsModule,
    ContributorsModule,
    CategoriesModule,
    CountriesModule,
    OrganizationsModule,
    TransactionsModule,
    ResetPasswordsModule,
    OurEventsModule,
    WalletsModule,
    PostsModule,
    OrderEventsModule,
    PaymentsModule,
    CommentsModule,
    UploadsModule,
    ContactUsModule,
  ],
})
export class AppModule {}
