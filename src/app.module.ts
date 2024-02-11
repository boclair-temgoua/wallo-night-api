import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './app/databases/orm';
import { AppSeedDataSource } from './app/databases/orm/orm-config-seed';
import { AlbumsModule } from './modules/albums/albums.module';
import { AuthProvidersModule } from './modules/auth-providers/auth-providers.module';
import { CartOrdersModule } from './modules/cart-orders/cart-orders.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartsModule } from './modules/cats/cats.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { ContributionsModule } from './modules/contributions/contributions.module';
import { ContributorsModule } from './modules/contributors/contributors.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { DonationsModule } from './modules/donations/donations.module';
import { FaqsModule } from './modules/faqs/faqs.module';
import { FollowsModule } from './modules/follows/follows.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { LikesModule } from './modules/likes/likes.module';
import { MediaModule } from './modules/media/media.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PostsModule } from './modules/posts/posts.module';
import { ProductsModule } from './modules/products/products.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ResetPasswordsModule } from './modules/reset-passwords/reset-passwords.module';
import { SubscribesModule } from './modules/subscribes/subscribes.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';
import { WalletsModule } from './modules/wallets/wallets.module';

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
    CartsModule,
    WalletsModule,
    MediaModule,
    PostsModule,
    DonationsModule,
    CommentsModule,
    CurrenciesModule,
    MembershipsModule,
    FollowsModule,
    LikesModule,
    PaymentsModule,
    UploadsModule,
    AlbumsModule,
    JobsModule,
    OrdersModule,
    OrderItemsModule,
    CartOrdersModule,
    OrganizationsModule,
    SubscribesModule,
    CommissionsModule,
    AuthProvidersModule,
    ContributionsModule,
    ContactUsModule,
  ],
})
export class AppModule {}
