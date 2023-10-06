import {
  withPagination,
  WithPaginationResponse,
} from '../../app/utils/pagination/with-pagination';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../models/Project';
import { Repository } from 'typeorm';
import {
  CreateProjectOptions,
  GetProjectsSelections,
  GetOneProjectSelections,
  UpdateProjectOptions,
  UpdateProjectSelections,
} from './projects.type';
import { useCatch } from '../../app/utils/use-catch';
import { generateNumber } from '../../app/utils/commons/generate-random';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private driver: Repository<Project>,
  ) {}

  async findAll(
    selections: GetProjectsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId } = selections;

    let query = this.driver
      .createQueryBuilder('project')
      .select('project.title', 'title')
      .addSelect('project.id', 'id')
      .addSelect('project.image', 'image')
      .addSelect('project.isActive', 'isActive')
      .addSelect('project.slug', 'slug')
      .addSelect('project.description', 'description')
      .where('project.deletedAt IS NULL');

    if (userId) {
      query = query.andWhere('project.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere('project.title ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, Projects] = await useCatch(
      query
        .orderBy('project.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Projects,
    });
  }

  async findOneBy(selections: GetOneProjectSelections): Promise<Project> {
    const { projectId } = selections;
    let query = this.driver
      .createQueryBuilder('project')
      .select('project.title', 'title')
      .addSelect('project.id', 'id')
      .addSelect('project.image', 'image')
      .addSelect('project.isActive', 'isActive')
      .addSelect('project.slug', 'slug')
      .addSelect('project.description', 'description')
      .where('project.deletedAt IS NULL');

    if (projectId) {
      query = query.andWhere('project.id = :id', {
        id: projectId,
      });
    }
    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('project not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Project to the database. */
  async createOne(options: CreateProjectOptions): Promise<Project> {
    const { userId, userCreatedId, title, image, organizationId, description } =
      options;

    const project = new Project();
    project.userId = userId;
    project.title = title;
    project.image = image;
    project.slug = `${Slug(title)}-${generateNumber(4)}`;
    project.organizationId = organizationId;
    project.userCreatedId = userCreatedId;
    project.description = description;

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
    const { projectId } = selections;
    const { title, image, description, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('project');

    if (projectId) {
      findQuery = findQuery.where('project.id = :id', { id: projectId });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.title = title;
    findItem.description = description;
    findItem.image = image;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
