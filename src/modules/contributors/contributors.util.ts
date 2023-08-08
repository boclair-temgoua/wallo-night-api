import { Injectable, NotFoundException } from '@nestjs/common';
import { ContributorsService } from './contributors.service';
import { FilterQueryType } from '../../app/utils/search-query/search-query.dto';

@Injectable()
export class ContributorsUtil {
  constructor(private readonly contributorsService: ContributorsService) {}

  /** Get one Authorization to the database. */
  async getAuthorizationToContributor(options: {
    userId: string;
  }): Promise<any> {
    const { userId } = options;
    if (userId) {
      const contributor = await this.contributorsService.findOneBy({
        userId,
        type: FilterQueryType.ORGANIZATION,
      });
      return { contributor };
    }

    return null;
  }
}
