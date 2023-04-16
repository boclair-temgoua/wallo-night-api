import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactProject } from '../../models/ContactProject';
import { Repository, Brackets } from 'typeorm';
import {
  CreateContactProjectOptions,
  GetContactProjectSelections,
  GetOneContactProjectSelections,
  UpdateContactProjectOptions,
  UpdateContactProjectSelections,
} from './contact-projects.type';
import * as Slug from 'slug';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { colorsArrays, generateNumber } from '../../app/utils/commons';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class ContactProjectsService {
  constructor(
    @InjectRepository(ContactProject)
    private driver: Repository<ContactProject>,
  ) {}

  async findAll(selections: GetContactProjectSelections): Promise<any> {
    const {
      type,
      search,
      pagination,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
    } = selections;

    let query = this.driver
      .createQueryBuilder('contactProject')
      .select('contactProject.contactId', 'contactId')
      .addSelect('contactProject.type', 'type')
      .addSelect('contactProject.organizationId', 'organizationId')
      .addSelect('contactProject.projectId', 'projectId')
      .addSelect('contactProject.subProjectId', 'subProjectId')
      .addSelect('contactProject.subSubProjectId', 'subSubProjectId')
      .addSelect('contactProject.subSubSubProjectId', 'subSubSubProjectId')
      .addSelect('contactProject.userCreatedId', 'userCreatedId')
      .addSelect('contactProject.createdAt', 'createdAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'id', "contact"."id",
              'slug', "contact"."slug",
              'firstName', "contact"."firstName",
              'lastName', "contact"."lastName",
              'email', "contact"."email",
              'color', "contact"."color",
              'phone', "contact"."phone",
              'otherPhone', "contact"."otherPhone",
              'address', "contact"."address",
              'countryId', "contact"."countryId",
              'description', "contact"."description",
              'userCreatedId', "contact"."userCreatedId",
              'categoryId', "contact"."categoryId",
              'organizationId', "contact"."organizationId",
              'category', "category"."name",
              'organizationId', "contact"."organizationId"
          ) AS "contact"`,
      )
      .where('contactProject.deletedAt IS NULL')
      .leftJoin('contactProject.contact', 'contact')
      .leftJoin('contact.category', 'category')
      .leftJoin('contactProject.organization', 'organization');

    if (type) {
      query = query.andWhere('contactProject.type = :type', { type });
    }

    if (organizationId) {
      query = query.andWhere(
        'contactProject.organizationId = :organizationId',
        {
          organizationId,
        },
      );
    }

    if (projectId) {
      query = query.andWhere('contactProject.projectId = :projectId', {
        projectId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('contactProject.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (subSubProjectId) {
      query = query.andWhere(
        'contactProject.subSubProjectId = :subSubProjectId',
        {
          subSubProjectId,
        },
      );
    }

    if (subSubSubProjectId) {
      query = query.andWhere(
        'contactProject.subSubSubProjectId = :subSubSubProjectId',
        {
          subSubSubProjectId,
        },
      );
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('contact.email ::text ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('contact.firstName ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('contact.lastName ::text ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, contactProjects] = await useCatch(
      query
        .orderBy('contactProject.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: contactProjects,
    });
  }

  async findOneBy(
    selections: GetOneContactProjectSelections,
  ): Promise<ContactProject> {
    const {
      type,
      contactId,
      contactProjectId,
      organizationId,
      projectId,
      subProjectId,
      subSubProjectId,
      subSubSubProjectId,
    } = selections;
    let query = this.driver
      .createQueryBuilder('contactProject')
      .where('contactProject.deletedAt IS NULL');

    if (type) {
      query = query.andWhere('contactProject.type = :type', { type });
    }

    if (organizationId) {
      query = query.andWhere(
        'contactProject.organizationId = :organizationId',
        {
          organizationId,
        },
      );
    }

    if (contactId) {
      query = query.andWhere('contactProject.contactId = :contactId', {
        contactId,
      });
    }

    if (projectId) {
      query = query.andWhere('contactProject.projectId = :projectId', {
        projectId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('contactProject.subProjectId = :subProjectId', {
        subProjectId,
      });
    }

    if (subSubProjectId) {
      query = query.andWhere(
        'contactProject.subSubProjectId = :subSubProjectId',
        { subSubProjectId },
      );
    }

    if (subSubSubProjectId) {
      query = query.andWhere(
        'contactProject.subSubSubProjectId = :subSubSubProjectId',
        { subSubSubProjectId },
      );
    }

    if (contactProjectId) {
      query = query.andWhere('contactProject.id = :id', {
        id: contactProjectId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('contactProject not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one ContactProjects to the database. */
  async createOne(
    options: CreateContactProjectOptions,
  ): Promise<ContactProject> {
    const {
      type,
      contactId,
      userCreatedId,
      subSubSubProjectId,
      subSubProjectId,
      subProjectId,
      projectId,
      organizationId,
    } = options;

    const contactProject = new ContactProject();
    contactProject.type = type;
    contactProject.contactId = contactId;
    contactProject.userCreatedId = userCreatedId;
    contactProject.subSubSubProjectId = subSubSubProjectId;
    contactProject.subSubProjectId = subSubProjectId;
    contactProject.projectId = projectId;
    contactProject.subProjectId = subProjectId;
    contactProject.organizationId = organizationId;

    const query = this.driver.save(contactProject);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one ContactProjects to the database. */
  async updateOne(
    selections: UpdateContactProjectSelections,
    options: UpdateContactProjectOptions,
  ): Promise<ContactProject> {
    const { contactProjectId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('contactProject');

    if (contactProjectId) {
      findQuery = findQuery.where('contactProject.id = :id', {
        id: contactProjectId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
