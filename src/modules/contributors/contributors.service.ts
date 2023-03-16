import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Contributor } from '../../models/Contributor';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Repository } from 'typeorm';
import {
  CreateContributorOptions,
  DeleteContributorSelections,
  GetOneContributorSelections,
  UpdateContributorOptions,
  UpdateContributorSelections,
} from './contributors.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private driver: Repository<Contributor>,
  ) {}

  async findOneBy(
    selections: GetOneContributorSelections,
  ): Promise<Contributor> {
    const { option1, option2 } = selections;
    let query = this.driver
      .createQueryBuilder('contributor')
      .leftJoinAndSelect('contributor.organization', 'organization');

    if (option1) {
      const { contributorId } = option1;
      query = query.where('contributor.id = :id', { id: contributorId });
    }

    if (option2) {
      const { userId, organizationId, contributeType, contributeId } = option2;
      query = query
        .where('contributor.userId = :userId', { userId })
        .andWhere('contributor.contributeType = :contributeType', {
          contributeType,
        })
        .andWhere('contributor.organizationId = :organizationId', {
          organizationId,
        })
        .andWhere('contributor.contributeId = :contributeId', {
          contributeId,
        });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('contributor not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Contributor to the database. */
  async createOne(options: CreateContributorOptions): Promise<Contributor> {
    const {
      contributeType,
      contributeId,
      organizationId,
      userCreatedId,
      role,
      userId,
    } = options;

    const contributor = new Contributor();
    contributor.contributeType = contributeType;
    contributor.contributeId = contributeId;
    contributor.organizationId = organizationId;
    contributor.userCreatedId = userCreatedId;
    contributor.role = role;
    contributor.userId = userId;

    const query = this.driver.save(contributor);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Contributor to the database. */
  async updateOne(
    selections: UpdateContributorSelections,
    options: UpdateContributorOptions,
  ): Promise<Contributor> {
    const { option1 } = selections;
    const { role } = options;

    let findQuery = this.driver.createQueryBuilder('contributor');

    if (option1) {
      const { contributorId } = option1;
      findQuery = findQuery.where('contributor.id = :id', {
        id: contributorId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.role = role;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  /** Update one contributor to the database. */
  async deleteOne(selections: DeleteContributorSelections): Promise<any> {
    const { option1 } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .delete()
      .from(Contributor);

    if (option1) {
      const { contributorId } = option1;
      query = query.where('id = :id', { id: contributorId });
    }

    const [errorUp, result] = await useCatch(query.execute());
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
