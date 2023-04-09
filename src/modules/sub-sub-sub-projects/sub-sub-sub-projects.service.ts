import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSubSubProject } from '../../models/SubSubSubProject';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Brackets, Repository } from 'typeorm';
import {
  CreateSubSubSubProjectOptions,
  GetOneSubSubSubProjectSelections,
  GetSubSubSubProjectsSelections,
  UpdateSubSubSubProjectOptions,
  UpdateSubSubSubProjectSelections,
} from './sub-sub-sub-projects.type';
import * as Slug from 'slug';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays, generateNumber } from '../../app/utils/commons';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class SubSubSubProjectsService {
  constructor(
    @InjectRepository(SubSubSubProject)
    private driver: Repository<SubSubSubProject>,
  ) {}

  async findAll(selections: GetSubSubSubProjectsSelections): Promise<any> {
    const {
      search,
      pagination,
      organizationId,
      projectId,
      subSubProjectId,
      subProjectId,
      subSubSubProjectId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('subSubSubProject')
      .where('subSubSubProject.deletedAt IS NULL');

    if (projectId) {
      query = query.andWhere('subSubSubProject.projectId = :projectId', {
        projectId,
      });
    }

    if (organizationId) {
      query = query.andWhere(
        'subSubSubProject.organizationId = :organizationId',
        {
          organizationId,
        },
      );
    }

    if (subProjectId) {
      query = query.andWhere('subSubSubProject.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (subSubProjectId) {
      query = query.andWhere(
        'subSubSubProject.subSubProjectId = :subSubProjectId',
        { subSubProjectId },
      );
    }

    if (subSubSubProjectId) {
      query = query.andWhere('subSubSubProject.id = :id', {
        id: subSubSubProjectId,
      });
    }

    // if (option1) {
    //   const { organizationId, projectId,subProjectId } = option1;
    //   query = query
    //     .andWhere('subSubProject.organizationId = :organizationId', {
    //       organizationId,
    //     })
    //     .andWhere('SubSubProject.projectId = :projectId', {
    //       projectId,
    //     }).andWhere('SubSubProject.subProjectId = :projectId', {
    //       projectId,
    //     });
    // }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('subSubSubProject.name ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('subSubSubProject.description ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, subSubProjects] = await useCatch(
      query
        .orderBy('subSubSubProject.createdAt', pagination?.sort)
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
    selections: GetOneSubSubSubProjectSelections,
  ): Promise<SubSubSubProject> {
    const { projectId, subSubProjectId, subProjectId, subSubSubProjectId } =
      selections;
    let query = this.driver
      .createQueryBuilder('subSubSubProject')
      .select('subSubSubProject.name', 'name')
      .addSelect('subSubSubProject.id', 'id')
      .addSelect('subSubSubProject.slug', 'slug')
      .addSelect('subSubSubProject.color', 'color')
      .addSelect('subSubSubProject.image', 'image')
      .addSelect('subSubSubProject.projectId', 'projectId')
      .addSelect('subSubSubProject.subProjectId', 'subProjectId')
      .addSelect('subSubSubProject.subSubProjectId', 'subSubProjectId')
      .addSelect('subSubSubProject.organizationId', 'organizationId')
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."subSubSubProjectId" = "subSubSubProject"."id"
      AND "con"."deletedAt" IS NULL
      AND "con"."type" IN ('SUBSUBSUBPROJECT'))
      GROUP BY "con"."subSubSubProjectId", "con"."type", "subSubSubProject"."id"
      ) AS "contributorTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT co) AS INT)
      FROM "contact" "co"
      WHERE ("co"."subSubSubProjectId" = "subSubSubProject"."id"
      AND "co"."type" IN ('SUBSUBSUBPROJECT')
      AND "co"."deletedAt" IS NULL)
      GROUP BY "co"."subSubSubProjectId", "subSubSubProject"."id"
      ) AS "contactTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT doc) AS INT)
      FROM "document" "doc"
      WHERE ("doc"."subSubSubProjectId" = "subSubSubProject"."id"
      AND "doc"."type" IN ('SUBSUBSUBPROJECT')
      AND "doc"."deletedAt" IS NULL)
      GROUP BY "doc"."subSubSubProjectId", "subSubSubProject"."id"
      ) AS "documentTotal"`,
      )
      .where('subSubSubProject.deletedAt IS NULL');

    if (projectId) {
      query = query.andWhere('subSubSubProject.projectId = :projectId', {
        projectId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('subSubSubProject.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (subSubProjectId) {
      query = query.andWhere(
        'subSubSubProject.subSubProjectId = :subSubProjectId',
        { subSubProjectId },
      );
    }

    if (subSubSubProjectId) {
      query = query.andWhere('subSubSubProject.id = :id', {
        id: subSubSubProjectId,
      });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('subSubProject not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one SubSubProject to the database. */
  async createOne(
    options: CreateSubSubSubProjectOptions,
  ): Promise<SubSubSubProject> {
    const {
      name,
      image,
      userCreatedId,
      description,
      organizationId,
      subProjectId,
      subSubProjectId,
      projectId,
    } = options;

    const subSubSubProject = new SubSubSubProject();
    subSubSubProject.name = name;
    subSubSubProject.image = image;
    subSubSubProject.slug = `${Slug(name)}-${generateNumber(4)}`;
    subSubSubProject.projectId = projectId;
    subSubSubProject.userCreatedId = userCreatedId;
    subSubSubProject.subProjectId = subProjectId;
    subSubSubProject.subSubProjectId = subSubProjectId;
    subSubSubProject.organizationId = organizationId;
    subSubSubProject.description = description;
    subSubSubProject.color = getRandomElement(colorsArrays);

    const query = this.driver.save(subSubSubProject);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one SubSubProject to the database. */
  async updateOne(
    selections: UpdateSubSubSubProjectSelections,
    options: UpdateSubSubSubProjectOptions,
  ): Promise<SubSubSubProject> {
    const { option1 } = selections;
    const { name, description, image, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('subSubSubProject');

    if (option1) {
      const { subSubSubProjectId } = option1;
      findQuery = findQuery.where('subSubSubProject.id = :id', {
        id: subSubSubProjectId,
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
