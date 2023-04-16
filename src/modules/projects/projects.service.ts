import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../models/Project';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Brackets, Repository } from 'typeorm';
import {
  CreateProjectOptions,
  GetOneProjectSelections,
  GetProjectsSelections,
  UpdateProjectOptions,
  UpdateProjectSelections,
} from './projects.type';
import * as Slug from 'slug';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays, generateNumber } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private driver: Repository<Project>,
  ) {}

  async findAll(selections: GetProjectsSelections): Promise<any> {
    const { search, pagination, option1 } = selections;

    let query = this.driver
      .createQueryBuilder('project')
      .where('project.deletedAt IS NULL');

    if (option1) {
      const { organizationId } = option1;
      query = query.andWhere('project.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('project.name ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('project.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, projects] = await useCatch(
      query
        .orderBy('project.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: projects,
    });
  }

  async findOneBy(selections: GetOneProjectSelections): Promise<Project> {
    const { option1 } = selections;
    let query = this.driver
      .createQueryBuilder('project')
      .select('project.name', 'name')
      .addSelect('project.id', 'id')
      .addSelect('project.image', 'image')
      .addSelect('project.color', 'color')
      .addSelect('project.slug', 'slug')
      .addSelect('project.description', 'description')
      .addSelect('project.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."projectId" = "project"."id"
      AND "con"."deletedAt" IS NULL
      AND "con"."type" IN ('PROJECT'))
      GROUP BY "con"."projectId", "con"."type", "project"."id"
      ) AS "contributorTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT sbprj) AS INT)
      FROM "sub_project" "sbprj"
      WHERE ("sbprj"."projectId" = "project"."id"
      AND "sbprj"."deletedAt" IS NULL)
      GROUP BY "sbprj"."projectId", "project"."id"
      ) AS "subProjectTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT cop) AS INT)
      FROM "contact_project" "cop"
      WHERE ("cop"."projectId" = "project"."id"
      AND "cop"."organizationId" = "project"."organizationId"
      AND "cop"."type" IN ('PROJECT')
      AND "cop"."deletedAt" IS NULL)
      GROUP BY "cop"."projectId", "project"."id"
      ) AS "contactTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT doc) AS INT)
      FROM "document" "doc"
      WHERE ("doc"."projectId" = "project"."id"
      AND "doc"."type" IN ('PROJECT')
      AND "doc"."deletedAt" IS NULL)
      GROUP BY "doc"."projectId", "project"."id"
      ) AS "documentTotal"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'id', "organization"."id",
          'color', "organization"."color",
          'userId', "organization"."userId",
          'name', "organization"."name"
      ) AS "organization"`,
      )
      .where('project.deletedAt IS NULL')
      .leftJoin('project.organization', 'organization');

    if (option1) {
      const { projectId } = option1;
      query = query.andWhere('project.id = :id', { id: projectId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('project not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Project to the database. */
  async createOne(options: CreateProjectOptions): Promise<Project> {
    const { name, userCreatedId, description, image, organizationId } = options;

    const project = new Project();
    project.name = name;
    project.image = image;
    project.slug = `${Slug(name)}-${generateNumber(4)}`;
    project.userCreatedId = userCreatedId;
    project.organizationId = organizationId;
    project.description = description;
    project.color = getRandomElement(colorsArrays);

    const query = this.driver.save(project);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Project to the database. */
  async updateOne(
    selections: UpdateProjectSelections,
    options: UpdateProjectOptions,
  ): Promise<Project> {
    const { option1 } = selections;
    const { name, description, image, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('project');

    if (option1) {
      const { projectId } = option1;
      findQuery = findQuery.where('project.id = :id', {
        id: projectId,
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
