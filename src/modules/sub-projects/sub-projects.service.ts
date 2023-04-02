import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { SubProject } from '../../models/SubProject';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Brackets, Repository } from 'typeorm';
import {
  CreateSubProjectOptions,
  GetOneSubProjectSelections,
  GetSubProjectsSelections,
  UpdateSubProjectOptions,
  UpdateSubProjectSelections,
} from './sub-projects.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class SubProjectsService {
  constructor(
    @InjectRepository(SubProject)
    private driver: Repository<SubProject>,
  ) {}

  async findAll(selections: GetSubProjectsSelections): Promise<any> {
    const { search, pagination, option1 } = selections;

    let query = this.driver
      .createQueryBuilder('subProject')
      .where('subProject.deletedAt IS NULL');

    if (option1) {
      const { organizationId, projectId } = option1;
      query = query
        .andWhere('subProject.organizationId = :organizationId', {
          organizationId,
        })
        .andWhere('subProject.projectId = :projectId', {
          projectId,
        });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('subProject.name ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('subProject.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, subProjects] = await useCatch(
      query
        .orderBy('subProject.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: subProjects,
    });
  }

  async findOneBy(selections: GetOneSubProjectSelections): Promise<SubProject> {
    const { option1 } = selections;
    let query = this.driver
      .createQueryBuilder('subProject')
      .select('subProject.name', 'name')
      .addSelect('subProject.id', 'id')
      .addSelect('subProject.color', 'color')
      .addSelect('subProject.image', 'image')
      .addSelect('subProject.projectId', 'projectId')
      .addSelect('subProject.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."subProjectId" = "subProject"."id"
      AND "con"."type" IN ('SUBPROJECT'))
      GROUP BY "con"."subProjectId", "con"."type", "subProject"."id"
      ) AS "contributorTotal"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'color', "organization"."color",
          'userId', "organization"."userId",
          'name', "organization"."name"
      ) AS "organization"`,
      )
      .where('subProject.deletedAt IS NULL')
      .leftJoin('subProject.organization', 'organization');

    if (option1) {
      const { subProjectId } = option1;
      query = query.andWhere('subProject.id = :id', { id: subProjectId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('subProject not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one SubProject to the database. */
  async createOne(options: CreateSubProjectOptions): Promise<SubProject> {
    const {
      name,
      image,
      userCreatedId,
      description,
      organizationId,
      projectId,
    } = options;

    const subProject = new SubProject();
    subProject.name = name;
    subProject.image = image;
    subProject.projectId = projectId;
    subProject.userCreatedId = userCreatedId;
    subProject.organizationId = organizationId;
    subProject.description = description;
    subProject.color = getRandomElement(colorsArrays);

    const query = this.driver.save(subProject);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one SubProject to the database. */
  async updateOne(
    selections: UpdateSubProjectSelections,
    options: UpdateSubProjectOptions,
  ): Promise<SubProject> {
    const { option1 } = selections;
    const { name, description, image, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('subProject');

    if (option1) {
      const { subProjectId } = option1;
      findQuery = findQuery.where('subProject.id = :id', {
        id: subProjectId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.name = name;
    findItem.image = image;
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
