import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contributor } from '../../models/Contributor';
import { Brackets, Repository } from 'typeorm';
import {
  CreateContributorOptions,
  DeleteContributorSelections,
  GetContributorsSelections,
  GetOneContributorSelections,
  UpdateContributorOptions,
  UpdateContributorSelections,
} from './contributors.type';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private driver: Repository<Contributor>,
  ) {}

  async findAll(
    selections: GetContributorsSelections,
  ): Promise<GetContributorsSelections | any> {
    const { option1, option2, search, pagination } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .select('contributor.id', 'id')
      .addSelect('contributor.userCreatedId', 'userCreatedId')
      .addSelect('contributor.userId', 'userId')
      .addSelect('contributor.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'email', "userOrganization"."email",
          'userId', "organization"."userId",
          'color', "organization"."color",
          'name', "organization"."name"
      ) AS "organization"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'firstName', "profile"."firstName",
              'lastName', "profile"."lastName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'name', "contributor"."role"
      ) AS "role"`,
      )
      .addSelect('contributor.createdAt', 'createdAt')
      .where('contributor.deletedAt IS NULL');

    if (option1) {
      const { organizationId } = option1;
      query = query.andWhere('contributor.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (option2) {
      const { userId } = option2;
      query = query.andWhere('contributor.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('organization.name ::text ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('profile.firstName ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('profile.lastName ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('user.username ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('user.email ::text ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    query = query
      .leftJoin('contributor.organization', 'organization')
      .leftJoin('organization.user', 'userOrganization')
      .leftJoin('contributor.user', 'user')
      .leftJoin('user.profile', 'profile');

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, users] = await useCatch(
      query
        .orderBy('user.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: users,
    });
  }

  async findOneBy(
    selections: GetOneContributorSelections,
  ): Promise<Contributor> {
    const { option1, option2, option3 } = selections;
    let query = this.driver
      .createQueryBuilder('contributor')
      .select('contributor.id', 'id')
      .addSelect('contributor.userCreatedId', 'userCreatedId')
      .addSelect('contributor.userId', 'userId')
      .addSelect('contributor.organizationId', 'organizationId')
      .addSelect('contributor.type', 'type')
      .addSelect('contributor.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'email', "userOrganization"."email",
          'userId', "organization"."userId",
          'color', "organization"."color",
          'name', "organization"."name"
      ) AS "organization"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'name', "contributor"."role"
      ) AS "role"`,
      )
      .where('contributor.deletedAt IS NULL')
      .leftJoin('contributor.organization', 'organization')
      .leftJoin('organization.user', 'userOrganization')
      .leftJoin('contributor.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (option1) {
      const { organizationId, userId } = option1;
      query = query
        .andWhere('contributor.userId = :userId', {
          userId,
        })
        .andWhere('contributor.organizationId = :organizationId', {
          organizationId,
        });
    }

    if (option2) {
      const { contributorId } = option2;
      query = query.andWhere('contributor.id = :id', {
        id: contributorId,
      });
    }

    if (option3) {
      const { contributorId, organizationId } = option3;
      query = query
        .andWhere('contributor.id = :id', {
          id: contributorId,
        })
        .andWhere('contributor.organizationId = :organizationId', {
          organizationId,
        });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('contributor not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Contributor to the database. */
  async createOne(options: CreateContributorOptions): Promise<Contributor> {
    const { userId, organizationId, userCreatedId, role } = options;

    const contributor = new Contributor();
    contributor.userId = userId;
    contributor.organizationId = organizationId;
    contributor.userCreatedId = userCreatedId;
    contributor.role = role;

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

  /** Update one Contributor to the database. */
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
