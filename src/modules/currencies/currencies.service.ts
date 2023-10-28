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
  CreateCurrenciesOptions,
  UpdateCurrenciesOptions,
  GetCurrenciesSelections,
  GetOneCurrenciesSelections,
  UpdateCurrenciesSelections,
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
      .addSelect('currency.symbol', 'symbol');

    if (search) {
      query = query.andWhere(
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
      query.orderBy('currency.name', 'ASC').getRawMany(),
    );
    if (errors) throw new NotFoundException(errors);

    return results;
  }

  async findOneBy(selections: GetOneCurrenciesSelections): Promise<Currency> {
    const { currencyId, code } = selections;
    let query = this.driver
      .createQueryBuilder('currency')
      .select('currency.id', 'id')
      .addSelect('currency.name', 'name')
      .addSelect('currency.code', 'code')
      .addSelect('currency.amount', 'amount')
      .addSelect('currency.symbol', 'symbol')
      .where('currency.amount IS NOT NULL');

    if (currencyId) {
      query = query.andWhere('currency.id = :id', { id: currencyId });
    }

    if (code) {
      query = query.andWhere('currency.code = :code', { code });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('currency not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Currency to the database. */
  async createOne(options: CreateCurrenciesOptions): Promise<any> {
    const { name, code, symbol, amount } = options;

    const currency = new Currency();
    currency.name = name;
    currency.code = code;
    currency.symbol = symbol;
    currency.amount = amount;

    const query = this.driver.save(currency);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return currency;
  }

  /** Update one Currency to the database. */
  async updateOne(
    selections: UpdateCurrenciesSelections,
    options: UpdateCurrenciesOptions,
  ): Promise<Currency> {
    const { name, symbol, amount } = options;
    const { currencyId } = selections;

    let findQuery = this.driver.createQueryBuilder('currency');

    if (currencyId) {
      findQuery = findQuery.where('currency.id = :id', {
        id: currencyId,
      });
    }

    const [errorFind, currency] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    currency.name = name;
    currency.symbol = symbol;
    currency.amount = amount;

    const query = this.driver.save(currency);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
