import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { useCatch } from '../../app/utils/use-catch';
import { Provider } from '../../models/index';
import {
  CreateProviderOptions,
  GetOneProviderSelections,
  UpdateProviderOptions,
  UpdateProviderSelections,
} from './providers.type';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private driver: Repository<Provider>,
  ) {}

  async findOneBy(selections: GetOneProviderSelections): Promise<Provider> {
    const { authProviderId, providerId, name, email } = selections;
    let query = this.driver
      .createQueryBuilder('provider')
      .where('provider.deletedAt IS NULL');

    if (authProviderId) {
      query = query.andWhere('provider.id = :id', { id: authProviderId });
    }

    if (providerId) {
      query = query.andWhere('provider.providerId = :providerId', {
        providerId,
      });
    }

    if (name) {
      query = query.andWhere('provider.name = :name', {
        name,
      });
    }

    if (email) {
      query = query.andWhere('provider.email = :email', {
        email,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('provider not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Provider to the database. */
  async createOne(options: CreateProviderOptions): Promise<Provider> {
    const { name, email, providerId, userId } = options;

    const provider = new Provider();
    provider.name = name;
    provider.email = email;
    provider.providerId = providerId;
    provider.userId = userId;

    const query = this.driver.save(provider);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one AuthProvider to the database. */
  async updateOne(
    selections: UpdateProviderSelections,
    options: UpdateProviderOptions,
  ): Promise<Provider> {
    const { authProviderId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('provider');

    if (authProviderId) {
      findQuery = findQuery.where('provider.id = :id', {
        id: authProviderId,
      });
    }

    const [errorFind, provider] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    provider.deletedAt = deletedAt;

    const query = this.driver.save(provider);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
