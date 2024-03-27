import { Injectable } from '@nestjs/common';
import { config } from '../../app/config/index';
import { addYearsFormateDDMMYYDate } from '../../app/utils/formate-date';
import { Contributor, Profile } from '../../models';
import { ContributorsService } from '../contributors/contributors.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { DonationsService } from '../donations/donations.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProfilesService } from '../profiles/profiles.service';
import { SubscribesService } from '../subscribes/subscribes.service';
import { UserAddressService } from '../user-address/user-address.service';
import { WalletsService } from '../wallets/wallets.service';
import {
  CheckUserService,
  TokenJwtModel,
} from './middleware/check-user.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersUtil {
  constructor(
    private readonly usersService: UsersService,
    private readonly donationsService: DonationsService,
    private readonly walletsService: WalletsService,
    private readonly profilesService: ProfilesService,
    private readonly currenciesService: CurrenciesService,
    private readonly subscribesService: SubscribesService,
    private readonly checkUserService: CheckUserService,
    private readonly organizationsService: OrganizationsService,
    private readonly contributorsService: ContributorsService,
    private readonly userAddressService: UserAddressService,
  ) {}

  async saveOrUpdate(options: {
    provider: 'DEFAULT' | 'PROVIDER';
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    image?: Profile['image'];
    role: Contributor['role'];
    email_verified?: boolean;
    confirmedAt: Date;
  }): Promise<any> {
    const {
      username,
      email,
      role,
      provider,
      email_verified,
      password,
      firstName,
      lastName,
      image,
      confirmedAt,
    } = options;

    const findOnCurrency = await this.currenciesService.findOneBy({
      code: 'USD',
    });

    /** Create Profile */
    const profile = await this.profilesService.createOne({
      fullName: `${firstName} ${lastName}`,
      lastName,
      firstName,
      image,
      currencyId: findOnCurrency?.id,
      description: 'Welcome to my profile page',
    });

    /** Create Organization */
    const organization = await this.organizationsService.createOne({
      name: `${firstName} ${lastName}`,
    });

    /** Create User */
    const user = await this.usersService.createOne({
      email,
      provider,
      password,
      confirmedAt: confirmedAt,
      profileId: profile?.id,
      username,
      organizationId: organization?.id,
    });

    /** Create Contributor */
    await this.subscribesService.createOne({
      userId: user?.id,
      subscriberId: user?.id,
      expiredAt: addYearsFormateDDMMYYDate({
        date: new Date(),
        yearNumber: 70,
      }),
    });

    /** Create Wallet */
    await this.walletsService.createOne({
      organizationId: user?.organizationId,
    });

    /** Create Subscribe */
    const contributor = await this.contributorsService.createOne({
      userId: user?.id,
      userCreatedId: user?.id,
      role: role,
      organizationId: organization?.id,
      confirmedAt: confirmedAt,
    });

    /** Create Donation */
    await this.donationsService.createOne({
      price: 5, // USD
      userId: user?.id,
      messageWelcome: '🎉 Thank you for the support! 🎉',
    });

    /** Update Organization */
    await this.organizationsService.updateOne(
      { organizationId: organization?.id },
      { userId: user?.id },
    );

    /** Create UserAddress */
    await this.userAddressService.createOne({
      firstName: firstName,
      lastName: lastName,
      userId: user?.id,
      organizationId: organization?.id,
    });

    return { user, contributor };
  }

  async createTokenLogin(options: {
    userId: string;
    organizationId: string;
  }): Promise<any> {
    const { userId, organizationId } = options;

    const tokenUser = await this.checkUserService.createToken(
      {
        userId: userId,
        organizationId: organizationId,
      } as TokenJwtModel,
      config.cookie_access.accessExpire,
    );

    return tokenUser;
  }
}
