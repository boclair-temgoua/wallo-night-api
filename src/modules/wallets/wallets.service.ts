import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Wallet } from '../../models/Wallet';
import { useCatch } from '../../app/utils/use-catch';
import {
  CreateWalletOptions,
  GetWalletsSelections,
  UpdateWalletOptions,
  UpdateWalletSelections,
} from './wallets.type';
import { formateNowDateYYMMDD, generateNumber } from '../../app/utils/commons';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private driver: Repository<Wallet>,
  ) {}

  /** Create one Wallet to the database. */
  async createOne(options: CreateWalletOptions): Promise<Wallet> {
    const { accountId, amount, userId } = options;

    const wallet = new Wallet();
    wallet.accountId = `${formateNowDateYYMMDD(new Date())}${generateNumber(
      10,
    )}`;
    wallet.amount = amount;
    wallet.userId = userId;

    const query = this.driver.save(wallet);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Wallet to the database. */
  async updateOne(
    selections: UpdateWalletSelections,
    options: UpdateWalletOptions,
  ): Promise<Wallet> {
    const { walletId } = selections;
    const { amount } = options;

    let findQuery = this.driver.createQueryBuilder('wallet');

    if (walletId) {
      findQuery = findQuery.where('wallet.id = :id', {
        id: walletId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.amount = amount;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}