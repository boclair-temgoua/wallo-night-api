import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../../models/Contact';
import { Repository } from 'typeorm';
import {
  CreateContactOptions,
  GetContactsSelections,
  GetOneContactSelections,
  UpdateContactOptions,
  UpdateContactSelections,
} from './contacts.type';
import { useCatch } from '../../app/utils/use-catch';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private driver: Repository<Contact>,
  ) {}

  async findAll(selections: GetContactsSelections): Promise<any> {
    const { search } = selections;

    let query = this.driver
      .createQueryBuilder('contact')
      .where('contact.deletedAt IS NULL');

    if (search) {
      query = query.andWhere('contact.name ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [error, Contacts] = await useCatch(
      query.orderBy('contact.createdAt', 'DESC').getMany(),
    );
    if (error) throw new NotFoundException(error);

    return Contacts;
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
      description,
      userCreatedId,
      organizationId,
    } = options;

    const contact = new Contact();
    contact.ipLocation = ipLocation;
    contact.fullName = fullName;
    contact.phone = phone;
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
    const { isRed,deletedAt } = options;

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
