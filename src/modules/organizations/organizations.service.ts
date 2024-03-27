import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getRandomElement } from '../../app/utils/array';
import { colorsArrays } from '../../app/utils/commons';
import { useCatch } from '../../app/utils/use-catch';
import { Organization } from '../../models/Organization';
import {
  CreateOrganizationOptions,
  GetOneOrganizationSelections,
  UpdateOrganizationOptions,
  UpdateOrganizationSelections,
} from './organizations.type';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private driver: Repository<Organization>,
  ) {}

  async findOneBy(
    selections: GetOneOrganizationSelections,
  ): Promise<Organization> {
    const { organizationId, userId } = selections;
    let query = this.driver.createQueryBuilder('organization');

    if (organizationId) {
      query = query.where('organization.id = :id', { id: organizationId });
    }

    if (userId) {
      query = query.where('organization.userId = :userId', { userId });
    }

    const organization = await query.getOne();

    return organization;
  }

  /** Create one Organization to the database. */
  async createOne(options: CreateOrganizationOptions): Promise<Organization> {
    const { userId, name, firstAddress, secondAddress } = options;

    const organization = new Organization();
    organization.userId = userId;
    organization.firstAddress = firstAddress;
    organization.secondAddress = secondAddress;
    organization.name = name;
    organization.color = getRandomElement(colorsArrays);

    const query = this.driver.save(organization);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Organization to the database. */
  async updateOne(
    selections: UpdateOrganizationSelections,
    options: UpdateOrganizationOptions,
  ): Promise<Organization> {
    const { organizationId } = selections;
    const { userId, name, image, firstAddress, secondAddress } = options;

    let findQuery = this.driver.createQueryBuilder('organization');

    if (organizationId) {
      findQuery = findQuery.where('organization.id = :id', {
        id: organizationId,
      });
    }

    const [errorFind, organization] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    organization.userId = userId;
    organization.name = name;
    organization.image = image;
    organization.firstAddress = firstAddress;
    organization.secondAddress = secondAddress;

    const query = this.driver.save(organization);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
