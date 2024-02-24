import { Injectable } from '@nestjs/common';
import { addYearsFormateDDMMYYDate } from '../../app/utils/commons/formate-date';
import { generateNumber } from '../../app/utils/commons/generate-random';
import { ContributorsService } from '../contributors/contributors.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { DonationsService } from '../donations/donations.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ResetPasswordsService } from '../reset-passwords/reset-passwords.service';
import { SubscribesService } from '../subscribes/subscribes.service';
import { WalletsService } from '../wallets/wallets.service';
import { CheckUserService } from './middleware/check-user.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersUtil {
  constructor(
    private readonly usersService: UsersService,
    private readonly donationsService: DonationsService,
    private readonly walletsService: WalletsService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
    private readonly currenciesService: CurrenciesService,
    private readonly subscribesService: SubscribesService,
    private readonly organizationsService: OrganizationsService,
    private readonly contributorsService: ContributorsService,
    private readonly resetPasswordsService: ResetPasswordsService,
  ) {}

  async saveOrUpdate(options: {
    provider: 'google' | 'github' | 'provider' | 'default';
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    image?: string;
    email_verified?: boolean;
  }): Promise<any> {
    const {
      email,
      provider,
      email_verified,
      password,
      firstName,
      lastName,
      username,
      image,
    } = options;

    const findOnUserByUsername = await this.usersService.findOneBy({
      username,
    });
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
    const usernameGenerate = `${firstName}-${lastName}-${generateNumber(6)}`;
    const user = await this.usersService.createOne({
      email,
      provider,
      password,
      confirmedAt: email_verified === true ? new Date() : null,
      profileId: profile?.id,
      username: username
        ? findOnUserByUsername
          ? usernameGenerate
          : username
        : usernameGenerate,
      organizationId: organization?.id,
    });

    /** Create Contributor */
    await this.subscribesService.createOne({
      userId: user?.id,
      subscriberId: user?.id,
      expiredAt: addYearsFormateDDMMYYDate({
        date: new Date(),
        yearNumber: 50,
      }),
    });

    /** Create Wallet */
    await this.walletsService.createOne({
      organizationId: user?.organizationId,
    });

    /** Create Subscribe */
    await this.contributorsService.createOne({
      userId: user?.id,
      userCreatedId: user?.id,
      role: 'ADMIN',
      organizationId: organization?.id,
    });

    /** Create Donation */
    await this.donationsService.createOne({
      price: 5, // USD
      userId: user?.id,
      messageWelcome: 'Thank you for the support! 🎉',
    });

    /** Update Organization */
    await this.organizationsService.updateOne(
      { organizationId: organization?.id },
      { userId: user?.id },
    );

    return { user };
  }
}
