import { withPagination } from '../../app/utils/pagination/with-pagination';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../../models/Group';
import { Repository } from 'typeorm';
import {
  CreateGroupOptions,
  GetGroupsSelections,
  GetOneGroupSelections,
  UpdateGroupOptions,
  UpdateGroupSelections,
} from './groups.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';
import { generateNumber } from '../../app/utils/commons/generate-random';
import { getRandomElement } from '../../app/utils/array/get-random-element';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private driver: Repository<Group>,
  ) {}

  async findAll(selections: GetGroupsSelections): Promise<any> {
    const {
      search,
      pagination,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('group')
      .select('group.name', 'name')
      .addSelect('group.slug', 'slug')
      .addSelect('group.id', 'id')
      .addSelect('group.color', 'color')
      .addSelect('group.image', 'image')
      .addSelect('group.description', 'description')
      .addSelect('group.organizationId', 'organizationId')
      .where('group.deletedAt IS NULL');

    if (organizationId) {
      query = query.andWhere('group.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (projectId) {
      query = query.andWhere('group.projectId = :projectId', {
        projectId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('group.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (subSubProjectId) {
      query = query.andWhere('group.subSubProjectId = :subSubProjectId', {
        subSubProjectId,
      });
    }

    if (subSubSubProjectId) {
      query = query.andWhere('group.subSubSubProjectId = :subSubSubProjectId', {
        subSubSubProjectId,
      });
    }

    if (search) {
      query = query.andWhere('group.name ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Groups] = await useCatch(
      query
        .orderBy('group.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Groups,
    });
  }

  async findOneBy(selections: GetOneGroupSelections): Promise<Group> {
    const {
      groupId,
      subSubSubProjectId,
      subSubProjectId,
      subProjectId,
      projectId,
      organizationId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('group')
      .select('group.name', 'name')
      .addSelect('group.slug', 'slug')
      .addSelect('group.id', 'id')
      .addSelect('group.color', 'color')
      .addSelect('group.image', 'image')
      .addSelect('group.description', 'description')
      .addSelect('group.organizationId', 'organizationId')
      .addSelect('group.projectId', 'projectId')
      .addSelect('group.subProjectId', 'subProjectId')
      .addSelect('group.subSubProjectId', 'subSubProjectId')
      .addSelect('group.subSubSubProjectId', 'subSubSubProjectId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."groupId" = "group"."id"
      AND "con"."deletedAt" IS NULL
      AND "con"."type" IN ('GROUP'))
      GROUP BY "con"."groupId", "con"."type", "group"."id"
      ) AS "contributorTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT po) AS INT)
      FROM "post" "po"
      WHERE ("po"."groupId" = "group"."id"
      AND "po"."deletedAt" IS NULL)
      GROUP BY "po"."groupId", "group"."id"
      ) AS "postTotal"`,
      )
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
          'id', "project"."id",
          'name', "project"."name",
          'slug', "project"."slug",
          'description', "project"."description",
          'color', "project"."color",
          'organizationId', "project"."organizationId"
      ) AS "project"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "subProject"."id",
          'name', "subProject"."name",
          'slug', "subProject"."slug",
          'description', "subProject"."description",
          'color', "subProject"."color",
          'projectId', "subProject"."projectId",
          'organizationId', "subProject"."organizationId"
      ) AS "subProject"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "subSubProject"."id",
          'name', "subSubProject"."name",
          'slug', "subSubProject"."slug",
          'description', "subSubProject"."description",
          'color', "subSubProject"."color",
          'projectId', "subSubProject"."projectId",
          'subProjectId', "subSubProject"."subProjectId",
          'organizationId', "subSubProject"."organizationId"
      ) AS "subSubProject"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "subSubSubProject"."id",
          'name', "subSubSubProject"."name",
          'slug', "subSubSubProject"."slug",
          'description', "subSubSubProject"."description",
          'color', "subSubSubProject"."color",
          'projectId', "subSubSubProject"."projectId",
          'subProjectId', "subSubSubProject"."subProjectId",
          'subSubProjectId', "subSubSubProject"."subSubProjectId",
          'organizationId', "subSubSubProject"."organizationId"
      ) AS "subSubSubProject"`,
      )
      .where('group.deletedAt IS NULL');

    if (organizationId) {
      query = query.andWhere('group.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (groupId) {
      query = query.andWhere('group.id = :id', {
        id: groupId,
      });
    }

    if (projectId) {
      query = query.andWhere('group.projectId = :projectId', {
        projectId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('group.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (subSubProjectId) {
      query = query.andWhere('group.subSubProjectId = :subSubProjectId', {
        subSubProjectId,
      });
    }

    if (subSubSubProjectId) {
      query = query.andWhere('group.subSubSubProjectId = :subSubSubProjectId', {
        subSubSubProjectId,
      });
    }

    query = query
      .leftJoin('group.project', 'project')
      .leftJoin('group.subProject', 'subProject')
      .leftJoin('group.subSubProject', 'subSubProject')
      .leftJoin('group.subSubSubProject', 'subSubSubProject')
      .leftJoin('group.organization', 'organization');

    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Group to the database. */
  async createOne(options: CreateGroupOptions): Promise<Group> {
    const {
      userCreatedId,
      name,
      description,
      organizationId,
      subSubSubProjectId,
      subSubProjectId,
      projectId,
      subProjectId,
    } = options;

    const group = new Group();
    group.name = name;
    group.organizationId = organizationId;
    group.slug = `${Slug(name)}-${generateNumber(4)}`;
    group.color = getRandomElement(colorsArrays);
    group.description = description;
    group.userCreatedId = userCreatedId;
    group.subSubSubProjectId = subSubSubProjectId;
    group.subSubProjectId = subSubProjectId;
    group.projectId = projectId;
    group.subProjectId = subProjectId;

    const query = this.driver.save(group);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Group to the database. */
  async updateOne(
    selections: UpdateGroupSelections,
    options: UpdateGroupOptions,
  ): Promise<Group> {
    const { option1 } = selections;
    const { name, description, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('group');

    if (option1) {
      findQuery = findQuery.where('group.id = :id', {
        id: option1.groupId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.name = name;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
