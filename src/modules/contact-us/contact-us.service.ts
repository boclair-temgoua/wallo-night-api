import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactUs } from '../../models/ContactUs';
import { Repository, Brackets } from 'typeorm';
import {
  CreateContactUsOptions,
  GetContactUsSelections,
  GetOneContactUsSelections,
  UpdateContactUsOptions,
  UpdateContactUsSelections,
} from './contact-us.type';
import { useCatch } from '../../app/utils/use-catch';
import { withPagination } from '../../app/utils/pagination/with-pagination';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private driver: Repository<ContactUs>,
  ) {}

  async findAll(selections: GetContactUsSelections): Promise<any> {
    const { search, pagination, option1 } = selections;

    let query = this.driver
      .createQueryBuilder('contactUs')
      .where('contactUs.deletedAt IS NULL');

    if (option1) {
      const { organizationId } = option1;
      query = query.andWhere('contactUs.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('contactUs.email ::text ILIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('contactUs.fullName ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('contactUs.phone ::text ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('contactUs.subject ::text ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, contactUs] = await useCatch(
      query
        .orderBy('contactUs.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: contactUs,
    });
  }

  async findOneBy(selections: GetOneContactUsSelections): Promise<ContactUs> {
    const { option1 } = selections;
    let query = this.driver
      .createQueryBuilder('contactUs')
      .where('contactUs.deletedAt IS NULL');

    if (option1) {
      const { contactUsId } = option1;
      query = query.andWhere('contactUs.id = :id', { id: contactUsId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('contactUs not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one ContactUs to the database. */
  async createOne(options: CreateContactUsOptions): Promise<ContactUs> {
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

    const contactUs = new ContactUs();
    contactUs.ipLocation = ipLocation;
    contactUs.fullName = fullName;
    contactUs.phone = phone;
    contactUs.subject = subject;
    contactUs.countryId = countryId;
    contactUs.email = email;
    contactUs.description = description;
    contactUs.userCreatedId = userCreatedId;
    contactUs.organizationId = organizationId;

    const query = this.driver.save(contactUs);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one ContactUs to the database. */
  async updateOne(
    selections: UpdateContactUsSelections,
    options: UpdateContactUsOptions,
  ): Promise<ContactUs> {
    const { option1 } = selections;
    const { isRed, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('contactUs');

    if (option1) {
      findQuery = findQuery.where('contactUs.id = :id', {
        id: option1.contactUsId,
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
