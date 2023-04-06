import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsService } from '../organizations/organizations.service';
import { ContributorsService } from './contributors.service';
import { FilterQueryType } from '../../app/utils/search-query/search-query.dto';

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
        organizationId,
        userId,
        type: FilterQueryType.ORGANIZATION,
      });
      return { organization, contributor };
    }

    return null;
  }
}
