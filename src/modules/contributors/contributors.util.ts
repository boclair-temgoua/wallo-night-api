import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsService } from '../organizations/organizations.service';
import { ContributorsService } from './contributors.service';

@Injectable()
export class ContributorsUtil {
  constructor(
    private readonly contributorsService: ContributorsService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  /** Get one Authorization to the database. */
  async getAuthorizationToContributor(options: {
    userId: string;
    organizationId: string;
  }): Promise<any> {
    const { organizationId, userId } = options;
    if (organizationId) {
      const organization = await this.organizationsService.findOneBy({
        option1: { organizationId },
      });

      const contributor = await this.contributorsService.findOneBy({
        option1: { organizationId, userId },
      });
      return { organization, contributor };
    }

    return null;
  }
}
