import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from '../../models/Application';
import { Repository } from 'typeorm';
import {
  CreateApplicationOptions,
  GetApplicationsSelections,
  GetOneApplicationSelections,
  UpdateApplicationOptions,
  UpdateApplicationSelections,
} from './applications.type';
import { useCatch } from '../../app/utils/use-catch';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { colorsArrays } from '../../app/utils/commons/get-colors';
import { generateLongUUID } from '../../app/utils/commons/generate-random';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private driver: Repository<Application>,
  ) {}

  async findAll(selections: GetApplicationsSelections): Promise<any> {
    const { search, option1 } = selections;

    let query = this.driver
      .createQueryBuilder('application')
      .where('application.deletedAt IS NULL');

    if (option1) {
      const { userId } = option1;
      query = query.andWhere('application.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere('application.name ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [error, applications] = await useCatch(
      query.orderBy('application.createdAt', 'DESC').getMany(),
    );
    if (error) throw new NotFoundException(error);

    return applications;
  }

  async findOneBy(
    selections: GetOneApplicationSelections,
  ): Promise<Application> {
    const { option1 } = selections;
    let query = this.driver
      .createQueryBuilder('application')
      .where('application.deletedAt IS NULL');

    if (option1) {
      const { applicationId } = option1;
      query = query.andWhere('application.id = :id', {
        id: applicationId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Faq to the database. */
  async createOne(options: CreateApplicationOptions): Promise<Application> {
    const { userId, userCreatedId, organizationId, name } = options;

    const application = new Application();
    application.color = getRandomElement(colorsArrays);
    application.userId = userId;
    application.token = generateLongUUID(50);
    application.organizationId = organizationId;
    application.userCreatedId = userCreatedId;
    application.name = name;

    const query = this.driver.save(application);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Faq to the database. */
  async updateOne(
    selections: UpdateApplicationSelections,
    options: UpdateApplicationOptions,
  ): Promise<Application> {
    const { option1 } = selections;
    const { name, color, token, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('application');

    if (option1) {
      findQuery = findQuery.where('application.id = :id', {
        id: option1.applicationId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.name = name;
    findItem.color = color;
    findItem.token = token;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
