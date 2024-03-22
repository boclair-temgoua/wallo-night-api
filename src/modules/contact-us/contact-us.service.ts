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
import { ContactUs } from '../../models/ContactUs';
import {
  CreateContactUsOptions,
  GetContactUsSelections,
  GetOneContactUsSelections,
  UpdateContactUsOptions,
  UpdateContactUsSelections,
} from './contact-us.type';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private driver: Repository<ContactUs>,
  ) {}

  async findAll(
    selections: GetContactUsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination } = selections;

    let query = this.driver
      .createQueryBuilder('contactUs')
      .where('contactUs.deletedAt IS NULL');

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
    const { contactUsId } = selections;
    let query = this.driver
      .createQueryBuilder('contactUs')
      .where('contactUs.deletedAt IS NULL');

    if (contactUsId) {
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
    const { contactUsId } = selections;
    const { isRed, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('contactUs');

    if (contactUsId) {
      findQuery = findQuery.where('contactUs.id = :id', {
        id: contactUsId,
      });
    }

    const [errorFind, contactUs] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    contactUs.isRed = isRed;
    contactUs.deletedAt = deletedAt;

    const query = this.driver.save(contactUs);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
