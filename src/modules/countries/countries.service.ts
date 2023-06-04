import { Country } from './../../models/Country';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import { GetCountriesSelections } from './countries.type';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private driver: Repository<Country>,
  ) {}

  async findAll(selections: GetCountriesSelections): Promise<any> {
    const { search } = selections;

    let query = this.driver.createQueryBuilder('country');

    if (search) {
      query = query.where(
        new Brackets((qb) => {
          qb.where(
            'country.name ::text ILIKE :search OR country.code ::text ILIKE :search',
            {
              search: `%${search}%`,
            },
          );
        }),
      );
    }

    const [errors, results] = await useCatch(
      query.orderBy('country.createdAt', 'DESC').getMany(),
    );
    if (errors) throw new NotFoundException(errors);

    return results;
  }
}
