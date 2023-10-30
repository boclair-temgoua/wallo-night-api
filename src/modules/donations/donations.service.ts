import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from '../../models/Donation';
import { Repository } from 'typeorm';
import {
  CreateDonationsOptions,
  GetOneDonationsSelections,
  UpdateDonationsOptions,
  UpdateDonationsSelections,
} from './donations.type';
import { useCatch } from '../../app/utils/use-catch';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private driver: Repository<Donation>,
  ) {}

  async findOneBy(selections: GetOneDonationsSelections): Promise<Donation> {
    const { donationId } = selections;
    let query = this.driver
      .createQueryBuilder('donation')
      .where('donation.deletedAt IS NULL');

    if (donationId) {
      query = query.andWhere('donation.id = :id', { id: donationId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Donation not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Gifts to the database. */
  async createOne(options: CreateDonationsOptions): Promise<Donation> {
    const {
      title,
      price,
      userId,
      messageWelcome,
      description,
    } = options;

    const donation = new Donation();
    donation.title = title;
    donation.price = price;
    donation.userId = userId;
    donation.userId = userId;
    donation.description = description;
    donation.messageWelcome = messageWelcome;

    const query = this.driver.save(donation);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Donations to the database. */
  async updateOne(
    selections: UpdateDonationsSelections,
    options: UpdateDonationsOptions,
  ): Promise<Donation> {
    const { donationId } = selections;
    const {
      title,
      price,
      userId,
      messageWelcome,
      description,
    } = options;

    let findQuery = this.driver.createQueryBuilder('donation');

    if (donationId) {
      findQuery = findQuery.where('donation.id = :id', { id: donationId });
    }

    const [errorFind, donation] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    donation.title = title;
    donation.price = price;
    donation.userId = userId;
    donation.userId = userId;
    donation.description = description;
    donation.messageWelcome = messageWelcome;
    const query = this.driver.save(donation);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
