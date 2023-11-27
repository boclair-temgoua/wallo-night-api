import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthProvider } from '../../models/index';
import { Repository } from 'typeorm';
import {
  CreateAuthProviderOptions,
  GetOneAuthProviderSelections,
  UpdateAuthProviderOptions,
  UpdateAuthProviderSelections,
} from './auth-Providers.type';
import { useCatch } from '../../app/utils/use-catch';

@Injectable()
export class AuthProvidersService {
  constructor(
    @InjectRepository(AuthProvider)
    private driver: Repository<AuthProvider>,
  ) {}

  async findOneBy(
    selections: GetOneAuthProviderSelections,
  ): Promise<AuthProvider> {
    const { authProviderId, providerId } = selections;
    let query = this.driver.createQueryBuilder('authProvider');

    if (authProviderId) {
      query = query.where('authProvider.id = :id', { id: authProviderId });
    }

    if (providerId) {
      query = query.where('authProvider.providerId = :providerId', {
        providerId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('authProvider not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one AuthProvider to the database. */
  async createOne(options: CreateAuthProviderOptions): Promise<AuthProvider> {
    const { name, email, providerId, userId } = options;

    const authProvider = new AuthProvider();
    authProvider.name = name;
    authProvider.email = email;
    authProvider.providerId = providerId;
    authProvider.userId = userId;

    const query = this.driver.save(authProvider);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one AuthProvider to the database. */
  async updateOne(
    selections: UpdateAuthProviderSelections,
    options: UpdateAuthProviderOptions,
  ): Promise<AuthProvider> {
    const { authProviderId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('authProvider');

    if (authProviderId) {
      findQuery = findQuery.where('authProvider.id = :id', {
        id: authProviderId,
      });
    }

    const [errorFind, authProvider] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    authProvider.deletedAt = deletedAt;

    const query = this.driver.save(authProvider);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
