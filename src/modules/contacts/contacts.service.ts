import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../../models/Contact';
import { Repository, Brackets } from 'typeorm';
import {
  CreateContactOptions,
  GetContactSelections,
  GetOneContactSelections,
  UpdateContactOptions,
  UpdateContactSelections,
} from './contacts.type';
import * as Slug from 'slug';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { colorsArrays, generateNumber } from '../../app/utils/commons';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private driver: Repository<Contact>,
  ) {}

  async findAll(selections: GetContactSelections): Promise<any> {
    const {
      search,
      pagination,
      organizationId,
      projectId,
      subProjectId,
      type,
    } = selections;

    let query = this.driver
      .createQueryBuilder('contact')
      .select('contact.firstName', 'firstName')
      .addSelect('contact.id', 'id')
      .addSelect('contact.slug', 'slug')
      .addSelect('contact.createdAt', 'createdAt')
      .addSelect('contact.lastName', 'lastName')
      .addSelect('contact.email', 'email')
      .addSelect('contact.color', 'color')
      .addSelect('contact.phone', 'phone')
      .addSelect('contact.address', 'address')
      .addSelect('contact.image', 'image')
      .addSelect('contact.countryId', 'countryId')
      .addSelect('contact.description', 'description')
      .addSelect('contact.userCreatedId', 'userCreatedId')
      .addSelect('contact.organizationId', 'organizationId')
      .addSelect('contact.projectId', 'projectId')
      .addSelect('contact.subProjectId', 'subProjectId')
      .addSelect('contact.categoryId', 'categoryId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'id', "category"."id",
              'color', "category"."color",
              'name', "category"."name",
              'organizationId', "category"."organizationId"
          ) AS "category"`,
      )
      .where('contact.deletedAt IS NULL')
      .leftJoin('contact.organization', 'organization')
      .leftJoin('contact.category', 'category');

    if (type) {
      query = query.andWhere('contact.type = :type', { type });
    }

    if (organizationId) {
      query = query.andWhere('contact.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (projectId) {
      query = query.andWhere('contact.projectId = :projectId', {
        projectId,
      });
    }

    if (subProjectId) {
      query = query.andWhere('contact.subProjectId = :subProjectId', {
        subProjectId,
      });
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

    const [error, Contacts] = await useCatch(
      query
        .orderBy('contact.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: Contacts,
    });
  }

  async findOneBy(selections: GetOneContactSelections): Promise<Contact> {
    const { contactId, organizationId } = selections;
    let query = this.driver
      .createQueryBuilder('contact')
      .where('contact.deletedAt IS NULL');

    if (organizationId) {
      query = query.andWhere('contact.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (contactId) {
      query = query.andWhere('contact.id = :id', { id: contactId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('contact not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Contacts to the database. */
  async createOne(options: CreateContactOptions): Promise<Contact> {
    const {
      firstName,
      lastName,
      phone,
      countryId,
      email,
      address,
      description,
      userCreatedId,
      projectId,
      subProjectId,
      image,
      type,
      categoryId,
      organizationId,
    } = options;

    const contact = new Contact();
    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.phone = phone;
    contact.countryId = countryId;
    contact.email = email;
    contact.type = type;
    contact.address = address;
    contact.description = description;
    contact.projectId = projectId;
    contact.subProjectId = subProjectId;
    contact.image = image;
    contact.slug = `${Slug(`${firstName}-${lastName}`)}-${generateNumber(4)}`;
    contact.color = getRandomElement(colorsArrays);
    contact.categoryId = categoryId;
    contact.userCreatedId = userCreatedId;
    contact.organizationId = organizationId;

    const query = this.driver.save(contact);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Contacts to the database. */
  async updateOne(
    selections: UpdateContactSelections,
    options: UpdateContactOptions,
  ): Promise<Contact> {
    const { contactId } = selections;
    const {
      firstName,
      lastName,
      phone,
      countryId,
      email,
      address,
      description,
      userCreatedId,
      projectId,
      subProjectId,
      categoryId,
      image,
      organizationId,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('contact');

    if (contactId) {
      findQuery = findQuery.where('contact.id = :id', {
        id: contactId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.firstName = firstName;
    findItem.lastName = lastName;
    findItem.phone = phone;
    findItem.countryId = countryId;
    findItem.email = email;
    findItem.address = address;
    findItem.description = description;
    findItem.userCreatedId = userCreatedId;
    findItem.projectId = projectId;
    findItem.subProjectId = subProjectId;
    findItem.categoryId = categoryId;
    findItem.organizationId = organizationId;
    findItem.image = image;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
