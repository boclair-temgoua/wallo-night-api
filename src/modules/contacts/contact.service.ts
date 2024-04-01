import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Contact } from '../../models/Contact';
import {
  CreateContactOptions,
  GetContactSelections,
  GetOneContactSelections,
  UpdateContactOptions,
  UpdateContactSelections,
} from './contact.type';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private driver: Repository<Contact>,
  ) {}

  async findAll(
    selections: GetContactSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination } = selections;

    let query = this.driver
      .createQueryBuilder('contact')
      .where('contact.deletedAt IS NULL');

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

    const [error, contact] = await useCatch(
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
      value: contact,
    });
  }

  async findOneBy(selections: GetOneContactSelections): Promise<Contact> {
    const { contactId } = selections;
    let query = this.driver
      .createQueryBuilder('contact')
      .where('contact.deletedAt IS NULL');

    if (contactId) {
      query = query.andWhere('contact.id = :id', { id: contactId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('contact not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one ContactUs to the database. */
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

    const query = this.driver.save(contact);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one ContactUs to the database. */
  async updateOne(
    selections: UpdateContactSelections,
    options: UpdateContactOptions,
  ): Promise<Contact> {
    const { contactId } = selections;
    const { isRed, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('contact');

    if (contactId) {
      findQuery = findQuery.where('contact.id = :id', {
        id: contactId,
      });
    }

    const [errorFind, contact] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    contact.isRed = isRed;
    contact.deletedAt = deletedAt;

    const query = this.driver.save(contact);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
