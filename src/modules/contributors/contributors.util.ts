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
    type: string;
  }): Promise<any> {
    const { userId, organizationId, type } = options;
    if (organizationId) {
      const organization = await this.organizationsService.findOneBy({
        option1: { organizationId },
      });

      const contributorOrganization = await this.contributorsService.findOneBy({
        option2: {
          userId,
          organizationId,
          contributeType: type,
          contributeId: organization.id,
        },
      });
      return { organization, contributorOrganization };
    }

    return null;
  }
}
