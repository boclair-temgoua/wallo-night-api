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
  GetContactsSelections,
  GetOneContactSelections,
  UpdateContactOptions,
  UpdateContactSelections,
} from './contacts.type';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private driver: Repository<Contact>,
  ) {}

  async findAll(selections: GetContactsSelections): Promise<any> {
    const { search, pagination, option1 } = selections;

    let query = this.driver
      .createQueryBuilder('contact')
      .where('contact.deletedAt IS NULL');

    if (option1) {
      const { organizationId } = option1;
      query = query.andWhere('contact.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('contact.email ::text ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('contact.fullName ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('contact.phone ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('contact.subject ::text ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, contacts] = await useCatch(
      query
        .orderBy('contact.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: contacts,
    });
  }

  async findOneBy(selections: GetOneContactSelections): Promise<Contact> {
    const { option1 } = selections;
    let query = this.driver
      .createQueryBuilder('contact')
      .where('contact.deletedAt IS NULL');

    if (option1) {
      const { contactId } = option1;
      query = query.andWhere('contact.id = :id', { id: contactId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('contact not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Contact to the database. */
  async createOne(options: CreateContactOptions): Promise<Contact> {
    const {
      ipLocation,
      fullName,
      phone,
      countryId,
      email,
      subject,
      description,
      userCreatedId,
      organizationId,
    } = options;

    const contact = new Contact();
    contact.ipLocation = ipLocation;
    contact.fullName = fullName;
    contact.phone = phone;
    contact.subject = subject;
    contact.countryId = countryId;
    contact.email = email;
    contact.description = description;
    contact.userCreatedId = userCreatedId;
    contact.organizationId = organizationId;

    const query = this.driver.save(contact);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Contact to the database. */
  async updateOne(
    selections: UpdateContactSelections,
    options: UpdateContactOptions,
  ): Promise<Contact> {
    const { option1 } = selections;
    const { isRed, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('contact');

    if (option1) {
      findQuery = findQuery.where('contact.id = :id', {
        id: option1.contactId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.isRed = isRed;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
