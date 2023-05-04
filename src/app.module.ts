import { ProfilesModule } from './modules/profiles/profiles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppDataSource } from './app/databases/config';
import { ConfigModule } from '@nestjs/config';
import { FaqsModule } from './modules/faqs/faqs.module';
import { UsersModule } from './modules/users/users.module';
import { AppSeedDataSource } from './app/databases/config/orm-config-seed';
import { ResetPasswordsModule } from './modules/reset-passwords/reset-passwords.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forRoot(AppSeedDataSource.options),
    ScheduleModule.forRoot(),
    FaqsModule,
    ProfilesModule,
    UsersModule,
    CategoriesModule,
    ResetPasswordsModule,
    ContactUsModule,
  ],
})
export class AppModule {}
