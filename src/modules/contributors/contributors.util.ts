import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersService } from '../users/users.service';
import { ContributorsService } from './contributors.service';

@Injectable()
export class ContributorsUtil {
  constructor(
    private readonly contributorsService: ContributorsService,
    private readonly usersService: UsersService,

    private readonly organizationsService: OrganizationsService,
  ) {}

  /** Get one Authorization to the database. */
  async findOneUserOrganizationContributor({
    userId,
    email,
  }: {
    userId?: string;
    email?: string;
  }): Promise<{ user: any; organization: any; contributor: any }> {
    const user = await this.usersService.findOneBy({ userId, email });
    if (!user)
      throw new HttpException(
        `User don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const organization = await this.organizationsService.findOneBy({
      userId: user?.id,
    });
    if (!organization)
      throw new HttpException(
        `Organization don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const contributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      organizationId: organization?.id,
      type: 'ORGANIZATION',
    });
    if (!contributor)
      throw new HttpException(
        `Contributor don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return { user, organization, contributor };
  }

  /** Get one Authorization to the database. */
  async findOneUserAuthorize({
    userId,
    email,
  }: {
    userId?: string;
    email?: string;
  }): Promise<any> {
    const user = await this.usersService.findOneBy({ userId, email });
    if (!user) throw new UnauthorizedException('Invalid user');

    const contributor = await this.contributorsService.findOneBy({
      userId: user?.id,
      organizationId: user?.organizationId,
      type: 'ORGANIZATION',
    });
    if (!contributor)
      throw new HttpException(
        `Contributor don't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    return { user, contributor };
  }
}
