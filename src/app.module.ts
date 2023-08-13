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
import { ProductsModule } from './modules/products/products.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CartsModule } from './modules/cats/cats.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { MediaModule } from './modules/media/media.module';
import { GiftsModule } from './modules/gifts/gifts.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { ContributionsModule } from './modules/contributions/contributions.module';
import { WithdrawalsModule } from './modules/withdrawals/withdrawals.module';
import { WithdrawalUsersModule } from './modules/withdrawal-users/withdrawal-users.module';
import { PostsModule } from './modules/posts/posts.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { GalleriesModule } from './modules/galleries/galleries.module';
import { CommentsModule } from './modules/comments/comments.module';

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
    TransactionsModule,
    ResetPasswordsModule,
    ProductsModule,
    DiscountsModule,
    CampaignsModule,
    CartsModule,
    WalletsModule,
    MediaModule,
    GiftsModule,
    PostsModule,
    CommentsModule,
    CurrenciesModule,
    WithdrawalsModule,
    MembershipsModule,
    GalleriesModule,
    WithdrawalUsersModule,
    ContributionsModule,
    ContactUsModule,
  ],
})
export class AppModule {}
