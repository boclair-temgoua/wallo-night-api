import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSubProject } from '../../models/SubSubProject';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Brackets, Repository } from 'typeorm';
import {
  CreateSubSubProjectOptions,
  GetOneSubSubProjectSelections,
  GetSubSubProjectsSelections,
  UpdateSubSubProjectOptions,
  UpdateSubSubProjectSelections,
} from './sub-sub-projects.type';
import * as Slug from 'slug';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays, generateNumber } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class SubSubProjectsService {
  constructor(
    @InjectRepository(SubSubProject)
    private driver: Repository<SubSubProject>,
  ) {}

  async findAll(selections: GetSubSubProjectsSelections): Promise<any> {
    const {
      search,
      pagination,
      organizationId,
      projectId,
      subSubProjectId,
      subProjectId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('subSubProject')
      .where('subSubProject.deletedAt IS NULL');

    if (projectId) {
      query = query.andWhere('subSubProject.projectId = :projectId', {
        projectId,
      });
    }

    if (organizationId) {
      query = query.andWhere('subSubProject.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('subSubProject.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (subSubProjectId) {
      query = query.andWhere('subSubProject.id = :id', { id: subSubProjectId });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('subSubProject.name ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('subSubProject.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, subSubProjects] = await useCatch(
      query
        .orderBy('subSubProject.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: subSubProjects,
    });
  }

  async findOneBy(
    selections: GetOneSubSubProjectSelections,
  ): Promise<SubSubProject> {
    const { projectId, subSubProjectId, subProjectId } = selections;
    let query = this.driver
      .createQueryBuilder('subSubProject')
      .select('subSubProject.name', 'name')
      .addSelect('subSubProject.id', 'id')
      .addSelect('subSubProject.slug', 'slug')
      .addSelect('subSubProject.color', 'color')
      .addSelect('subSubProject.image', 'image')
      .addSelect('subSubProject.projectId', 'projectId')
      .addSelect('subSubProject.subProjectId', 'subProjectId')
      .addSelect('subSubProject.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."subSubProjectId" = "subSubProject"."id"
      AND "con"."deletedAt" IS NULL
      AND "con"."type" IN ('SUBSUBPROJECT'))
      GROUP BY "con"."subSubProjectId", "con"."type", "subSubProject"."id"
      ) AS "contributorTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT co) AS INT)
      FROM "contact" "co"
      WHERE ("co"."subSubProjectId" = "subSubProject"."id"
      AND "co"."type" IN ('SUBSUBPROJECT')
      AND "co"."deletedAt" IS NULL)
      GROUP BY "co"."subSubProjectId", "subSubProject"."id"
      ) AS "contactTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT doc) AS INT)
      FROM "document" "doc"
      WHERE ("doc"."subSubProjectId" = "subSubProject"."id"
      AND "doc"."type" IN ('SUBSUBPROJECT')
      AND "doc"."deletedAt" IS NULL)
      GROUP BY "doc"."subSubProjectId", "subSubProject"."id"
      ) AS "documentTotal"`,
      )
      .where('subSubProject.deletedAt IS NULL');

    if (projectId) {
      query = query.andWhere('subSubProject.projectId = :projectId', {
        projectId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('subSubProject.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (subSubProjectId) {
      query = query.andWhere('subSubProject.id = :id', { id: subSubProjectId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('SubSubProject not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one SubSubProject to the database. */
  async createOne(options: CreateSubSubProjectOptions): Promise<SubSubProject> {
    const {
      name,
      image,
      userCreatedId,
      description,
      organizationId,
      subProjectId,
      projectId,
    } = options;

    const subSubProject = new SubSubProject();
    subSubProject.name = name;
    subSubProject.image = image;
    subSubProject.slug = `${Slug(name)}-${generateNumber(4)}`;
    subSubProject.projectId = projectId;
    subSubProject.userCreatedId = userCreatedId;
    subSubProject.subProjectId = subProjectId;
    subSubProject.organizationId = organizationId;
    subSubProject.description = description;
    subSubProject.color = getRandomElement(colorsArrays);

    const query = this.driver.save(subSubProject);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one SubSubProject to the database. */
  async updateOne(
    selections: UpdateSubSubProjectSelections,
    options: UpdateSubSubProjectOptions,
  ): Promise<SubSubProject> {
    const { option1 } = selections;
    const { name, description, image, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('subSubProject');

    if (option1) {
      const { subSubProjectId } = option1;
      findQuery = findQuery.where('subSubProject.id = :id', {
        id: subSubProjectId,
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
