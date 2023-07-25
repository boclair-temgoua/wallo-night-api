import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WithdrawalUser } from '../../models/WithdrawalUser';
import { Brackets, Repository } from 'typeorm';
import {
  CreateWithdrawalUserOptions,
  GetOneWithdrawalUserSelections,
  GetWithdrawalUsersSelections,
  UpdateWithdrawalUserOptions,
  UpdateWithdrawalUserSelections,
} from './withdrawal-users.type';
import { useCatch } from '../../app/utils/use-catch';
import { isNotUndefined } from '../../app/utils/commons/generate-random';
import {
  WithPaginationResponse,
  withPagination,
} from '../../app/utils/pagination/with-pagination';

@Injectable()
export class WithdrawalUsersService {
  constructor(
    @InjectRepository(WithdrawalUser)
    private driver: Repository<WithdrawalUser>,
  ) {}

  async findAll(
    selections: GetWithdrawalUsersSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, userId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('withdrawalUser')
      .where('withdrawalUser.deletedAt IS NULL');

    if (userId && isNotUndefined(String(userId))) {
      query = query.andWhere('withdrawalUser.userId = :userId', { userId });
    }

    if (organizationId && isNotUndefined(String(organizationId))) {
      query = query.andWhere('withdrawalUser.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search && isNotUndefined(String(search))) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('withdrawalUser.description ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('withdrawalUser.title ::text ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('withdrawalUser.email ::text ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, withdrawalUsers] = await useCatch(
      query
        .orderBy('withdrawalUser.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: withdrawalUsers,
    });
  }

  async findOneBy(selections: GetOneWithdrawalUserSelections): Promise<WithdrawalUser> {
    const { withdrawalUserId } = selections;
    let query = this.driver
      .createQueryBuilder('withdrawalUser')
      .where('withdrawalUser.deletedAt IS NULL');

    if (withdrawalUserId) {
      query = query.andWhere('withdrawalUser.id = :id', { id: withdrawalUserId });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('withdrawalUser not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one WithdrawalUser to the database. */
  async createOne(options: CreateWithdrawalUserOptions): Promise<WithdrawalUser> {
    const {
      title,
      email,
      iban,
      phone,
      description,
      type,
      userId,
      organizationId,
    } = options;

    const withdrawalUser = new WithdrawalUser();
    withdrawalUser.title = title;
    withdrawalUser.email = email;
    withdrawalUser.iban = iban;
    withdrawalUser.phone = phone;
    withdrawalUser.userId = userId;
    withdrawalUser.type = type;
    withdrawalUser.organizationId = organizationId;
    withdrawalUser.description = description;

    const query = this.driver.save(withdrawalUser);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one WithdrawalUser to the database. */
  async updateOne(
    selections: UpdateWithdrawalUserSelections,
    options: UpdateWithdrawalUserOptions,
  ): Promise<WithdrawalUser> {
    const { withdrawalUserId } = selections;
    const { deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('withdrawalUser');

    if (withdrawalUserId) {
      findQuery = findQuery.where('withdrawalUser.id = :id', {
        id: withdrawalUserId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
