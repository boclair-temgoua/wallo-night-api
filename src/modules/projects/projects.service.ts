import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
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
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';
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
        .take(pagination.take)
        .skip(pagination.skip)
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
      .addSelect('project.color', 'color')
      .addSelect('project.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."projectId" = "project"."id"
      AND "con"."type" IN ('PROJECT'))
      GROUP BY "con"."projectId", "con"."type", "project"."id"
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
    const { name, userCreatedId, description, organizationId } = options;

    const project = new Project();
    project.name = name;
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
    const { name, description, deletedAt } = options;

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
    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
