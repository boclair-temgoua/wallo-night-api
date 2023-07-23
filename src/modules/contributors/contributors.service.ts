import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { FilterQueryType } from '../../app/utils/search-query/search-query.dto';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private driver: Repository<Contributor>,
  ) {}

  async findAll(
    selections: GetContributorsSelections,
  ): Promise<GetContributorsSelections | any> {
    const { userId, search, pagination, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .select('contributor.id', 'id')
      .addSelect('contributor.userCreatedId', 'userCreatedId')
      .addSelect('contributor.userId', 'userId')
      .addSelect('contributor.type', 'type')
      .addSelect('contributor.giftId', 'giftId')
      .addSelect('contributor.donationId', 'donationId')
      .addSelect('contributor.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
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

    if (organizationId) {
      query = query.andWhere('contributor.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (userId) {
      query = query.andWhere('contributor.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('organization.name ::text ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere(
              '(profile.firstName ::text ILIKE :search OR profile.lastName ::text ILIKE :search OR profile.phone ::text ILIKE :search)',
              {
                search: `%${search}%`,
              },
            )
            .orWhere(
              '(user.email ::text ILIKE :search OR user.username ::text ILIKE :search)',
              {
                search: `%${search}%`,
              },
            );
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
        .orderBy('contributor.createdAt', pagination?.sort)
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

  async findAllNotPaginate(
    selections: GetContributorsSelections,
  ): Promise<GetContributorsSelections | any> {
    const { userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .addSelect('contributor.createdAt', 'createdAt')
      .where('contributor.deletedAt IS NULL');

    if (organizationId) {
      query = query.andWhere('contributor.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (userId) {
      query = query.andWhere('contributor.userId = :userId', { userId });
    }

    const [error, contributors] = await useCatch(
      query.orderBy('contributor.createdAt', 'DESC').getMany(),
    );
    if (error) throw new NotFoundException(error);

    return contributors;
  }

  async findOneBy(selections: GetOneContributorSelections): Promise<any> {
    const { type, userId, organizationId, contributorId } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .select('contributor.id', 'id')
      .addSelect('contributor.giftId', 'giftId')
      .addSelect('contributor.userCreatedId', 'userCreatedId')
      .addSelect('contributor.userId', 'userId')
      .addSelect('contributor.type', 'type')
      .addSelect('contributor.donationId', 'donationId')
      .addSelect('contributor.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
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
      .where('contributor.deletedAt IS NULL')
      .leftJoin('contributor.organization', 'organization')
      .leftJoin('organization.user', 'userOrganization')
      .leftJoin('contributor.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (type) {
      query = query.andWhere('contributor.type = :type', { type });
    }

    if (organizationId) {
      query = query.andWhere('contributor.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (userId) {
      query = query.andWhere('contributor.userId = :userId', { userId });
    }

    if (contributorId) {
      query = query.andWhere('contributor.id = :id', { id: contributorId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('contributor not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Contributor to the database. */
  async createOne(options: CreateContributorOptions): Promise<Contributor> {
    const {
      userId,
      organizationId,
      donationId,
      giftId,
      role,
      userCreatedId,
      type,
    } = options;

    const contributor = new Contributor();
    contributor.userId = userId;
    contributor.type = type;
    contributor.role = role;
    contributor.giftId = giftId;
    contributor.donationId = donationId;
    contributor.organizationId = organizationId;
    contributor.userCreatedId = userCreatedId;
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
    const { role, deletedAt } = options;
    const { contributorId } = selections;

    let findQuery = this.driver.createQueryBuilder('contributor');

    if (contributorId) {
      findQuery = findQuery.where('contributor.id = :id', {
        id: contributorId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.role = role;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  /** Update one Contributor to the database. */
  async deleteOne(selections: DeleteContributorSelections): Promise<any> {
    const { contributorId } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .delete()
      .from(Contributor);

    if (contributorId) {
      query = query.where('id = :id', { id: contributorId });
    }

    const [errorUp, result] = await useCatch(query.execute());
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  /** Permission. project */
  async canCheckPermissionContributor(options: {
    userId: string;
    organizationId: string;
  }): Promise<any> {
    const { userId, organizationId } = options;

    const findOneContributor = await this.findOneBy({
      userId: userId,
      organizationId: organizationId,
      type: FilterQueryType.ORGANIZATION,
    });

    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    /** This condition check if user is ADMIN */
    if (!['ADMIN', 'MODERATOR'].includes(findOneContributor?.role?.name))
      throw new UnauthorizedException('Not authorized! Change permission');

    return findOneContributor;
  }
}
