import { Currency } from '../../models/Currency';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import {
  GetCurrenciesSelections,
  GetOneCurrenciesSelections,
} from './currencies.type';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private driver: Repository<Currency>,
  ) {}

  async findAll(selections: GetCurrenciesSelections): Promise<any> {
    const { search } = selections;

    let query = this.driver
      .createQueryBuilder('currency')
      .select('currency.id', 'id')
      .addSelect('currency.name', 'name')
      .addSelect('currency.code', 'code')
      .addSelect('currency.symbol', 'symbol')
      .where('currency.isActive IS TRUE');

    if (search) {
      query = query.where(
        new Brackets((qb) => {
          qb.where(
            'currency.name ::text ILIKE :search OR country.code ::text ILIKE :search',
            {
              search: `%${search}%`,
            },
          );
        }),
      );
    }

    const [errors, results] = await useCatch(
      query.orderBy('currency.createdAt', 'DESC').getRawMany(),
    );
    if (errors) throw new NotFoundException(errors);

    return results;
  }

  async findOneBy(selections: GetOneCurrenciesSelections): Promise<Currency> {
    const { currencyId } = selections;
    let query = this.driver
      .createQueryBuilder('currency')
      .select('currency.id', 'id')
      .addSelect('currency.name', 'name')
      .addSelect('currency.code', 'code')
      .addSelect('currency.amount', 'amount')
      .addSelect('currency.symbol', 'symbol');

    if (currencyId) {
      query = query.andWhere('currency.id = :id', { id: currencyId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('currency not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
